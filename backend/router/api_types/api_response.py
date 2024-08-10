from datetime import datetime, date

from typing import List, Literal, Optional
from pydantic import AwareDatetime, BaseModel

################################################################################
#################################     Admin    #################################
################################################################################
class CurrentExamResponse(BaseModel):
    id: int
    school: str
    type: str
    year: int
    subject: str
    file_location: str

class CurrentExamsResponse(BaseModel):
    exams: List[CurrentExamResponse]

class ReviewExamResponse(BaseModel):
    file_location: str

class ReviewExamsResponse(BaseModel):
    exams: List[ReviewExamResponse]

class UpdateExamResponse(BaseModel):
    success: bool
    message: str

class RegisteredUserData(BaseModel):
    first_name: str
    last_name: str
    email: str
    school: str
    school_year: int

class RegisteredUsersResponse(BaseModel):
    users: List[RegisteredUserData]

################################################################################
###################################     Ai    ##################################
################################################################################
class AiConversationMessage(BaseModel):
    id: int
    sequence_number: int
    author: Literal["tutor", "user"]
    contents: List[str]
    timestamp: AwareDatetime
    has_image: bool

class GetConversationResponse(BaseModel):
    messages: List[AiConversationMessage]

class PostConversationMessageResponse(BaseModel):
    student_message: AiConversationMessage
    tutor_message_id: int

class PostNewConversationResponse(BaseModel):
    conversation_id: int
    tutor_message_id: int

class ConversationBrief(BaseModel):
    conversation_id: int
    title: str
    subject: str
    timestamp: AwareDatetime

class GetConversationsResponse(BaseModel):
    conversations: List[ConversationBrief]

################################################################################
#################################     Auth     #################################
################################################################################
class LoginResponse(BaseModel):
    access_token: str
    expiration: AwareDatetime

class RegistrationResponse(BaseModel):
    access_token: str
    expiration: AwareDatetime

class RefreshResponse(BaseModel):
    access_token: str
    expiration: AwareDatetime

class UserPermissionsResponse(BaseModel):
    permissions: str

################################################################################
#################################     Exam     #################################
################################################################################
class ExamResponse(BaseModel):
    exam_id: int

################################################################################
#################################     Exams     ################################
################################################################################
class ExamDetails(BaseModel):
    id: int
    school_name: str
    type: str
    year: int
    favourite: bool
    upload_date: str
    likes: int
    subject: str
    difficulty: int

class ExamsResponse(BaseModel):
    exams: List[ExamDetails]

class FavouriteExamsResponse(BaseModel):
    exams: List[ExamDetails]

class RecentExamsResponse(BaseModel):
    exams: List[ExamDetails]

class RecommendedExamsResponse(BaseModel):
    exams: List[ExamDetails]

class ExamSchoolsResponse(BaseModel):
    schools: List[str]

class ExamSubjectsResponse(BaseModel):
    subjects: List[str]

################################################################################
#################################     Logo     #################################
################################################################################
class LogosResponse(BaseModel):
    logos: List[str]

################################################################################
#################################     User     #################################
################################################################################
class UserProfileResponse(BaseModel):
    name: str

class NotificationResponse(BaseModel):
    id: int
    sender: Optional[str] = None
    title: str
    message: str
    link: Optional[str] = None
    date_sent: datetime

class UserNotificationsResponse(BaseModel):
    notifications: List[NotificationResponse]

class ExamsComplete(BaseModel):
    subject: str
    number_complete: int

class UserAnalyticsCompletedSubjectExamsResponse(BaseModel):
    analytics: List[ExamsComplete]

class ExamTimeStat(BaseModel):
    date: date
    exams_complete: int

class UserAnalyticsActivityResponse(BaseModel):
    analytics: List[ExamTimeStat]

class TopicRecommendation(BaseModel):
    subject: str
    topic: str
    description: str
    question_id_link: int
    question_title: str

class UserTopicRecommendationsResponse(BaseModel):
    recommendations: List[TopicRecommendation]

################################################################################
#################################     Questions     ############################
################################################################################
class QuestionCard(BaseModel):
    id: int
    subject: str
    topic: str
    title: str
    grade: int
    difficulty: int

class QuestionsResponse(BaseModel):
    questions: List[QuestionCard]

class QuestionsSubjectsResponse(BaseModel):
    subjects: List[str]

class QuestionsTopicsResponse(BaseModel):
    topics: List[str]

################################################################################
#################################     Question      ############################
################################################################################

class QuestionResponse(BaseModel):
    id: int
    subject: str
    topic: str
    title: str
    grade: int
    difficulty: int
    question: str
    answers: List[str]
    image_locations: List[str]
