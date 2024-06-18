from typing import List, Optional
from pydantic import AwareDatetime, BaseModel

################################################################################
#################################     Admin    #################################
################################################################################
class SubmitReviewExamRequest(BaseModel):
    school: str
    exam_type: str
    year: int
    subject: str
    file_location: str

class DeleteReviewExamRequest(BaseModel):
    file_location: str

class UploadExamRequest(BaseModel):
    school: str
    year: int
    exam_type: str
    subject: str

################################################################################
#################################     Auth     #################################
################################################################################
class LoginRequest(BaseModel):
    email: str
    password: str

class RegistrationRequest(BaseModel):
    first_name: str
    last_name: str
    email: str
    password: str

class EditUserInformationRequest(BaseModel):
    dob: AwareDatetime
    school: str
    school_year: int

class GoogleLoginRequest(BaseModel):
    google_token: str

class FacebookLoginRequest(BaseModel):
    facebook_token: str

################################################################################
#################################     Exam     #################################
################################################################################
class ExamFavouriteRequest(BaseModel):
    exam_id: int

################################################################################
#################################     Exams     ################################
################################################################################
class Filter(BaseModel):
    schools: List[str]
    subjects: List[str]
    years: List[int]

class ExamsEndpointRequest(BaseModel):
    filter: Filter

################################################################################
#################################     Logo     #################################
################################################################################

################################################################################
#################################     User     #################################
################################################################################
class NotificationsSeenRequest(BaseModel):
    notifications: List[int]
