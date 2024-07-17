from datetime import datetime
from typing import List, Optional

from pydantic import BaseModel

class SessionDetailResponse(BaseModel):
    refresh_id: str
    user: int

class SchoolDetailsResponse(BaseModel):
    name: str
    logo_location: Optional[str] = None

class ExamDetailsResponse(BaseModel):
    id: int
    school: str
    exam_type: str
    year: int
    file_location: str
    date_uploaded: datetime
    subject: str
    difficulty: int
    likes: int

class UserDetailsResponse(BaseModel):
    first_name: str
    last_name: str
    email: str
    phone: Optional[str] = None
    registration_method: str
    permissions: str
    school: Optional[str] = None
    grade: Optional[int] = None

class NotificationResponse(BaseModel):
    id: int
    user: int
    sender: Optional[int] = None
    title: str
    message: str
    link: Optional[str] = None
    date_sent: datetime

class CompletedExamsResponse(BaseModel):
    exam: int
    date_complete: datetime

class QuestionCardResponse(BaseModel):
    id: int
    subject: str
    topic: str
    title: str
    grade: int
    difficulty: int

class QuestionsDetailsResponse(BaseModel):
    id: int
    subject: str
    topic: str
    title: str
    grade: int
    difficulty: int
    question: str
    answers: List[str]
    image_locations: List[str]
