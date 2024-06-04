from typing import List, Literal, Optional
from pydantic import AwareDatetime, BaseModel

ExamTypes = Literal['TRI', 'HSC', 'TOP', 'HAF', 'T_1', 'T_2', 'T_3', 'T_4']
RegistrationMethods = Literal['email', 'google', 'facebook']
Permissions = Literal['REG', 'PRE', 'ADM']

class SessionCreationRequest(BaseModel):
    refresh_id: str
    user: Optional[int] = None

class UserCreationRequest(BaseModel):
    first_name: str
    last_name: str
    email: str
    phone: Optional[str] = None
    registration_method: RegistrationMethods
    permissions: Optional[Permissions] = 'REG'

class UserUpdateRequest(BaseModel):
    user_id: int
    phone: Optional[str] = None
    dob: Optional[AwareDatetime] = None
    grade: Optional[int] = None
    school: Optional[str] = None
    permission: Optional[Permissions] = None

class SchoolCreationRequest(BaseModel):
    name: str
    logo_location: Optional[str] = None

class PasswordCreationRequest(BaseModel):
    user_id: int
    password: str

class ExamCreationRequest(BaseModel):
    school: int
    exam_type: ExamTypes
    year: int
    file_location: str
    date_uploaded: Optional[AwareDatetime] = None
    subject: str

class FavouriteExamRequest(BaseModel):
    user_id: int
    exam_id: int

class RecentlyViewedExamRequest(BaseModel):
    user_id: int
    exam_id: int

class ExamFilterRequest(BaseModel):
    school: Optional[List[str]] = None
    year: Optional[List[int]] = None
    exam_type: Optional[List[ExamTypes]] = None

class NotificationCreationRequest(BaseModel):
    user_id: int
    sender_id: Optional[int] = None
    title: str
    message: str
    link: Optional[str] = None