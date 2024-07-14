import PyPDF2
import os

from typing import List

from openai import OpenAI

GPT_PROMPT = """
You are tasked with extracting questions and formatting them into a specific JSON structure.

The JSON Structure is:
{
    "topic": "Complex Numbers" | "Proofs" | "Integration" | "Vectors" | "Mechanics",
    "question": List[string],
    "title": string
    "solution": List[string]
    "difficulty": int (1-5)
}

Follow these steps:

Identify the topic of each question from the provided list of topics: “Complex Numbers,” “Proofs,” “Integration,” “Vectors,” or “Mechanics”.
Extract the question and convert it into a list of strings. Each string should represent one sentence or line from the question. Use LaTeX formatting where necessary, wrapping mathematical expressions in dollar signs ($), and ensure to escape backslashes (\\).
Create a concise title for each question, not exceeding four words.
Format the solution as a list of strings, using LaTeX for mathematical expressions and escaping backslashes (\\).
Provide a difficulty rating for each question, from 1 to 5, with 1 being the easiest and 5 being the hardest.

Below is an example of the expected JSON format:

Example Question:
“Prove that there are no positive integers $x, y$ such that $x^2 - y^2 = 1$.”

Example Solution:
[
“Suppose by contradiction that $x^2 - y^2 = 1$ has solutions $x$, $y$ positive integers ()",
“$\\therefore (x + y)(x - y) = 1$”,
“$x + y = 1$ and $x - y = 1$ since $x$ and $y$ are integers #”,
"This contradicts () since $x + y = 1$ has no positive integral solutions, so there are no”,
“positive integers $x, y$ such that $x^2 - y^2 = 1$”
]

Expected JSON output:
{
“topic”: “Proofs”,
“question”: [
“Prove that there are no positive integers $x, y$ such that $x^2 - y^2 = 1$.”
],
“title”: “Proof by Contradiction”,
“solution”: [
“Suppose by contradiction that $x^2 - y^2 = 1$ has solutions $x$, $y$ positive integers ()",
“$\therefore (x + y)(x - y) = 1$”,
“$x + y = 1$ and $x - y = 1$ since $x$ and $y$ are integers #”,
"This contradicts () since $x + y = 1$ has no positive integral solutions, so there are no”,
“positive integers $x, y$ such that $x^2 - y^2 = 1$”
]
"difficulty": 2
}

Now, apply these steps to generate the JSON output texts that are provided.
"""

class Question:
    def __init__(self):
        self.subject = "Maths Extension 2"
        self.topic = None
        self.question = []
        self.title = None
        self.solution = []
        self.difficulty = 1

    def toJSON(self):
        return {
            "subject": self.subject,
            "topic": self.topic,
            "question": self.question,
            "title": self.title
        }


def extract_questions(pdf_path: str, client) -> List[Question]:
    """
    Extracts questions from the given PDF file.
    :param pdf_path: Path to the PDF file.
    :return: List of questions extracted from the PDF file.
    """
    pdf_text = _extract_text_from_pdf(pdf_path)

    print(pdf_text)

    questions = _extract_questions_from_text(pdf_text, client)

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
    questions = []

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
        model="gpt-4o",
        response_format={
            "type": "json_output"
        }
    )



    return questions

def _upload_question(question: Question):


if __name__ == "__main__":
    client = OpenAI(api_key=os.environ.get("OPENAI_API_KEY"))

    questions = extract_questions(os.path.join(os.getcwd(), "pdf/test2.pdf"), client)
    for question in questions:
        print(question)