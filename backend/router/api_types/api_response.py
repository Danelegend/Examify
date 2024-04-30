from typing import List
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

class ExamsResponse(BaseModel):
    exams: List[ExamDetails]

class FavouriteExamsResponse(BaseModel):
    exams: List[ExamDetails]

class RecentExamsResponse(BaseModel):
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
    exams_completed: int
