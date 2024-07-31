import json
import random

from datetime import date
from typing import Dict, List, Tuple

from database.helpers.questions import get_questions_with_pagination, get_topics
from database.helpers.completed import get_user_completed_exams
from database.helpers.exam import get_exam

from functionality.ai.gemini import send_message
from functionality.user.user import get_users_subjects
from functionality.types import SubjectType

from router.api_types.api_request import QuestionsFilter
from router.api_types.api_response import ExamTimeStat, TopicRecommendation

def get_user_subject_analytics(user_id: int) -> Dict[str, int]:
    """
    Given a user's id, returns a dictionary mapping a subject name
    to the number of exams completed for that subject
    """
    user_completed_exams = get_user_completed_exams(user_id, size=10000)

    result = {}

    for user_complete_exam in user_completed_exams:
        exam = get_exam(user_complete_exam.exam)
        
        subject = SubjectType.MapPrefixToName(exam.subject)

        if subject not in result:
            result[subject] = 0
        result[subject] += 1

    return result

def get_user_activity_analytics(user_id: int) -> List[ExamTimeStat]:
    """
    Given a user's id, get a list of the number exams they've completed
    """
    exams_completed = get_user_completed_exams(user_id, size=1000)

    d: Dict[date, int] = {}

    for exam in exams_completed:
        exam_completion_date = exam.date_complete.date()

        if exam_completion_date not in d:
            d[exam_completion_date] = 0

        d[exam_completion_date] += 1

    return [ExamTimeStat(
        date=date,
        exams_complete=d[date]
    ) for date in d]

def _calculate_number_recommendations_for_subjects(subjects: List[str], num_recommendations: int) -> Dict[str, int]:
    """
    Given a list of subjects, calculate the number of recommendations for each subject
    """
    subject_to_num_recommendations = {}

    if len(subjects) > num_recommendations:
        for subject in random.sample(subjects, num_recommendations):
            subject_to_num_recommendations[subject] = 1
    elif len(subjects) > 0:
        # Assign one to each subject then distribute the rest
        for subject in subjects:
            subject_to_num_recommendations[subject] = 1

        # TODO: Fix later
        #recommendations_left = num_recommendations - len(subjects)

        #for subject in random.sample(subjects, recommendations_left):
            #subject_to_num_recommendations[subject] += 1

    return subject_to_num_recommendations

def _get_recommended_topics_for_subject(subject: str, num_recommendations: int) -> List[str]:
    topics = get_topics(subject)

    return [] if len(topics) == 0 else random.sample(topics, min(len(topics), num_recommendations))

def _get_recommendation_description_and_subtopic(subject: str, topic: str) -> Tuple[str, str]:
    """
    Given a subject and topic, get a recommendation description and the subtopic to study
    """

    prompt = f"""
        How and why should I improve my understanding of {topic} in {subject} for the Australian Year 12 HSC? Give me a 3 lines maximum and provide a subtopic in {topic} I should study.
        Use and return the json schema
        {{
            "response": str,
            "subtopic": str
        }}
        Still include the subtopic in the response
        """

    response = json.loads(send_message(prompt))

    return response['response'], response['subtopic']

def _get_recommended_question(subject: str, topic: str, subtopic: str) -> Tuple[int, str]:
    """
    Return tuple of question id and question title
    """
    start = 0
    size = 30

    # Get the questions for the topic
    
    all_questions = get_questions_with_pagination(start, size, QuestionsFilter(subjects=[subject], topics=[topic]))

    while start * size < 300:
        for question in all_questions:
            if subtopic in question.title:
                return question.id, question.title

        start += 1
        all_questions = get_questions_with_pagination(start, size, QuestionsFilter(subjects=[subject], topics=[topic]))

    random_question = random.choice(all_questions)

    return random_question.id, random_question.title


def GetUserTopicRecommendations(user_id: int, num_recommendations=3) -> List[TopicRecommendation]:
    """
    Given a user's id, get a list of recommended topics
    """
    # Get the subjects that the user studies
    user_subjects = get_users_subjects(user_id)

    subject_to_num_recommendations = _calculate_number_recommendations_for_subjects(user_subjects, num_recommendations)
    
    recommendations = []

    for subject, num_recommendations in subject_to_num_recommendations.items():
        topics = _get_recommended_topics_for_subject(subject, num_recommendations)

        for topic in topics:
            help_description, subtopic = _get_recommendation_description_and_subtopic(subject, topic)
            rec_question_id, rec_question_title = _get_recommended_question(subject, topic, subtopic)

            recommendations.append(TopicRecommendation(
                subject=subject,
                topic=topic,
                description=help_description,
                question_id_link=rec_question_id,
                question_title=rec_question_title
            ))

    return recommendations