from typing import List, Literal, Optional
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

class UpdateExamRequest(BaseModel):
    school: Optional[str] = None
    year: Optional[int] = None
    exam_type: Optional[str] = None
    subject: Optional[str] = None

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
class ExamsFilter(BaseModel):
    schools: List[str]
    subjects: List[str]
    years: List[int]

class ExamsEndpointRequest(BaseModel):
    filter: ExamsFilter
    sort: Literal["relevance", "newest", "oldest", "most liked", "least liked", "recently uploaded"]

################################################################################
#################################     Logo     #################################
################################################################################

################################################################################
#################################     User     #################################
################################################################################
class NotificationsSeenRequest(BaseModel):
    notifications: List[int]

################################################################################
#################################     Questions     ############################
################################################################################
class QuestionsFilter(BaseModel):
    subjects: List[str]
    topics: List[str]
    grades: List[int]

class QuestionsRequest(BaseModel):
    filter: QuestionsFilter

################################################################################
#################################     Question      ############################
################################################################################
class QuestionCreationRequest(BaseModel):
    title: str
    subject: str
    topic: str
    grade: int
    difficulty: int
    question: str
    answers: List[str]
    images: List[str]

class QuestionAnswerRequest(BaseModel):
    question_id: int
    answers: List[str]