import json
import PyPDF2
import os

import requests

from typing import List

from openai import OpenAI
import google.generativeai as genai

GPT_PROMPT = """
You are tasked with extracting questions and formatting them into a specific JSON structure.

The JSON Structure you should return is:
{
    questions: Question[]
}

where Question is
{
    "topic": "Applications of Differentiation" | "Trigonometric Calculus" | "Continuous Probability" | "Exponentials & Logarithms" | "Graphing & Equations" | "Integration" | "Series & Sequences" | "Finance",
    "question": List[string],
    "title": string
    "difficulty": int (1-5)
}

Follow these steps:
Identify if there are any questions in the provided text.
Identify the topic of each question from the provided list of topics: "Applications of Differentiation" | "Trigonometric Calculus" | "Continuous Probability" | "Exponentials & Logarithms" | "Graphing & Equations" | "Integration" | "Series & Sequences" | "Finance".
Extract the question and convert it into a list of strings. Each string should represent one sentence or line from the question. Use LaTeX formatting where necessary, wrapping mathematical expressions in dollar signs ($), and ensure to escape backslashes (\\).
Create a concise title for each question, not exceeding four words.
Provide a difficulty rating for each question, from 1 to 5, with 1 being the easiest and 5 being the hardest.

Below is an example of the expected JSON format:

Example Question:
“Prove that there are no positive integers $x, y$ such that $x^2 - y^2 = 1$.”

Expected JSON output:
{
questions: [
{
“topic”: "Graphing & Equations",
“question”: [
“Prove that there are no positive integers $x, y$ such that $x^2 - y^2 = 1$.”
],
“title”: “Proof by Contradiction”,
"difficulty": 2
}
]
}

Now, apply these steps to generate the JSON output when the user provides you text.
"""

ACCESS_TOKEN = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJleHAiOjE3MjE3NDA5MTksImlhdCI6MTcyMTczMTkxOSwic2lkIjo2OSwiYWlkIjoiTkpoc1dRRUlpSSJ9.NSPNy0vK54OcuiQ87t-wB9Y4dmSnmEWx2uJzdKtZvJw"

OPEN_AI_KEY = "sk-proj-O4GeAKnZe7UjJOpmsEnbT3BlbkFJFi9p6V6BVfnFiQc1f5Wt"
GEMINI_AI_KEY = "AIzaSyAAxbMlDwfz7M2nGXXhJKubvQke9hRAdIY"

class Question:
    def __init__(self, topic=None, questions=None, title=None, solutions=None, difficulty=None, subject="Maths Advanced"):
        self.subject = subject
        self.topic = topic
        self.question = questions
        self.title = title
        self.solution = solutions
        self.difficulty = difficulty
        self.grade = 12

    def formatSolution(self) -> str | None:
        if len(self.solution) == 0: return None

        formatted = ""

        for s in self.solution:
            formatted += s + '\n'

        return formatted

    def formatQuestion(self) -> str:
        formatted = ""

        for s in self.question:
            formatted += s + '\n'
        
        return formatted

    def toJSON(self):
        if self.question is None or len(self.question) == 0 or self.title is None or len(self.question) == 0:
            print({
                    "title": self.title,
                    "topic": self.topic,
                    "difficulty": self.difficulty,
                    "question": self.question,
                    "soltuions": self.solution
                })
            raise ValueError()

        answer = self.formatSolution()

        return {
            "title": self.title,
            "subject": self.subject,
            "topic": self.topic,
            "grade": self.grade,
            "difficulty": self.difficulty,
            "question": self.formatQuestion(),
            "answers": [] if answer is None else [answer],
            "images": []
        }


def extract_questions(pdf_path: str, client) -> List[Question]:
    """
    Extracts questions from the given PDF file.
    :param pdf_path: Path to the PDF file.
    :return: List of questions extracted from the PDF file.
    """
    pdf_text = _extract_text_from_pdf(pdf_path)

    questions = _extract_questions_from_text(pdf_text, client)

    return questions

def extract_questions_per_page(pdf_path: str, client) -> List[Question]:
    questions = []

    with open(pdf_path, "rb") as file:
        reader = PyPDF2.PdfReader(file)

        for page in reader.pages:
            questions += _extract_questions_from_text(page.extract_text(), client)

    return questions

def _extract_text_from_pdf(pdf_path: str) -> str:
    """
    Extracts text from the given PDF file.
    :param pdf_path: Path to the PDF file.
    :return: Text extracted from the PDF file.
    """
    pdf_text = ""

    with open(pdf_path, "rb") as file:
        reader = PyPDF2.PdfReader(file)
        
        for page in reader.pages:
            pdf_text += page.extract_text()

    return pdf_text

def _extract_questions_from_text(text: str, client) -> List[Question]:
    """
    Extracts questions from the given text.
    :param text: Text to extract questions from.
    :return: List of questions extracted from the text.
    """
    chat = client.chat.completions.create(
        messages=[
            {
                "role": "system",
                "content": GPT_PROMPT
            },
            {
                "role": "user",
                "content": text
            }
        ],
        model="gpt-4o-mini",
        response_format={
            "type": "json_object"
        }
    )
    """
    chat_session = client.start_chat(
        history=[{
            "role": "model",
            "parts": GPT_PROMPT
        }]
    )

    response = chat_session.send_message(text)
    """
    
    return _gpt_response_to_questions(chat.choices[0].message.content)

def _gpt_response_to_questions(response: str) -> List[Question]:
    try:
        json_response = json.loads(response)
    except json.JSONDecodeError as de:
        print(f"Error for json: {response}")
        raise de

    return _parse_json_to_questions(json_response)

def _parse_json_to_questions(json_data) -> List[Question]:
    questions_list = json_data['questions']

    ret = []

    for question in questions_list:
        ret.append(
            Question(topic=question['topic'],
                     questions=question['question'],
                     title=question['title'],
                     solutions=[],
                     difficulty=question['difficulty'])
        )

    return ret


def _upload_question(question: Question):
    try:
        jsonData = question.toJSON()
        print(jsonData)
    except ValueError:
        return

    r = requests.post("https://service.examify.com.au/api/question/", 
                      json=jsonData,
                      headers={
                          "Content-Type": "application/json",
                          "Authorization": f"bearer {ACCESS_TOKEN}"
                      }, verify=False)
    
    if (r.status_code != 200):
        print(r.status_code)
        print(f"Error for json data: {jsonData}")
    else:
        print("Successful Upload")

def upload_questions(questions: List[Question]):
    for question in questions:
        _upload_question(question)

def test():
    genai.configure(api_key=GEMINI_AI_KEY)

    generation_config = {
        "temperature": 1,
        "top_p": 0.95,
        "top_k": 64,
        "max_output_tokens": 8192,
        "response_mime_type": "application/json"
    }

    client = genai.GenerativeModel(
        model_name="gemini-1.5-flash",
        generation_config=generation_config
    )

    for file in os.listdir(os.path.join(os.getcwd(), "pdf")):
        print(f"Starting {file}")
        path = os.path.join(os.getcwd(), f"pdf/{file}")
        try:
            questions = extract_questions_per_page(path, client)

            for question in questions:
                print(question.toJSON())

            #upload_questions(questions)
            print(f"Finished {file}")
        except Exception as e:
            print(f"Error for {file}: {e}")

if __name__ == "__main__":
    client = OpenAI(api_key=OPEN_AI_KEY)

    file_list = os.listdir(os.path.join(os.getcwd(), "pdf"))

    files_to_extract_questions = []

    for file in file_list:
        if file.endswith(".pdf"):
            files_to_extract_questions.append((os.path.join(os.getcwd(), f"pdf/{file}"), file.removesuffix(".pdf").split(",")))

    for data in files_to_extract_questions:
        path = data[0]

        print("PERFORMING ON FILE: ", path)

        questions = extract_questions_per_page(path, client)

        upload_questions(questions)


    print("DONE")
    