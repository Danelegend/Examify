from typing import List, Optional
from pydantic import BaseModel

class SessionDetailResponse(BaseModel):
    refresh_id: str
    user: int

class SchoolDetailsResponse(BaseModel):
    name: str
    logo_location: str

class ExamDetailsResponse(BaseModel):
    id: int
    school: int
    exam_type: str
    year: int
    file_location: str
    date_uploaded: str
    subject: str

class UserDetailsResponse(BaseModel):
    first_name: str
    last_name: str
    email: str
    phone: Optional[str] = None
    registration_method: str
    permissions: str
    school: Optional[str] = None
    grade: Optional[int] = None
