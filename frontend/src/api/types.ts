// REQUESTS

export type AdminExamReviewSubmitRequest = {
    school: string,
    exam_type: string,
    year: number,
    subject: string,
    file_location: string
}

export type AdminExamReviewDeleteRequest = {
    file_location: string
}

export type ExamUploadRequest = {
    file: File,
    school: string,
    year: number,
    type: string,
    grade: number,
    subject: string
}

export type ExamUpdateRequest = {
    exam_id: number,
    school: string,
    year: number,
    subject: string,
    exam_type: string
}

export type UserRegistrationRequest = {
    first_name: string,
    last_name: string,
    email: string,
    password: string
}

export type UserLoginRequest = {
    email: string,
    password: string
}

export type UserProfileEditRequest = {
    dob: Date,
    school: string,
    school_year: number
}

export type FetchExamsRequest = {
    page: number,
    page_length: number,
    filter: {
        schools: string[],
        subjects: string[],
        years: number[]
    },
    sort: "relevance" | "newest" | "oldest" | "most liked" | "least liked" | "recently uploaded"
}

export type FetchQuestionsRequest = {
    page: number,
    page_length: number,
    filter: {
        subjects: string[]
        topics: string[]
        grades: number[]
    }
}

export type PostUserQuestionAnswerRequest = {
    question_id: number
    answer: string[]
}

export type PostQuestionRequest = {
    title: string
    subject: string
    topic: string
    grade: number
    difficulty: number
    question: string
    answers: string[]
    image_locations: File[]
}

// RESPONSES

export type SignUpResponse = {
    status: number,
    detail?: string,
    access_token: string,
    refresh_token: string,
    expiration: string
}

export type SignInResponse = {
    status: number,
    message: string,
    access_token: string,
    refresh_token: string,
    expiration: string
}

export type SignOutResponse = {
    status: number,
    message: string
}

export type ExamCard = {
    id: number,
    school: string,
    year: number,
    type: string,
    difficulty: number
}

export type GetExamsResponse = {
    exams: ExamCard[]
}

export type RefreshTokenResponse = {
    access_token: string,
    expiration: string
}

export type ExamResponse = {
    exam_id: number,
}

export type FetchLogosResponse = {
    logos: string[] 
}

export type FetchUserResponse = {
    name: string,
    exams_completed: number
}

export type UserRegistrationResponse = {
    refresh_token: string,
    access_token: string
}

export type ExamDetails = {
    id: number,
    school_name: string,
    year: number,
    type: string
    favourite: boolean,
    upload_date: string,
    likes: number,
    subject: string

}

export type FetchExamsResponse = {
    exams: ExamDetails[]
}

export type FetchExamSubjectsResponse = {
    subjects: string[]
}

export type FetchSchoolsResponse = {
    schools: string[]
}

export type TemplateExamsResponse = {
    exams: ExamDetails[]
}

export type FetchFavouriteExamsResponse = {} & TemplateExamsResponse

export type FetchRecentExamsResponse = {} & TemplateExamsResponse

export type FetchRecommendedExamsResponse = {} & TemplateExamsResponse

export type FetchExamResponse = {
    exam_id: number
}

export type Notification = {
    id: number,
    sender: string | null,
    title: string,
    message: string,
    link: string | null,
    date_sent: Date
}

export type FetchNotificationsResponse = {
    notifications: Notification[]
}

export type ExamsComplete = {
    subject: string,
    number_complete: number
}

export type FetchUserSubjectAnalyticsResponse = {
    analytics: ExamsComplete[]
}

export type FetchUserActivityAnalyticsResponse = {
    analytics: {
        date: Date
        exams_complete: number
    }[]
}

export type FetchQuestionSubjectsResponse = {
    subjects: string[]
}

export type FetchQuestionTopicsResponse = {
    topics: string[]
}

export type FetchQuestionsResponse = {
    questions: {
        id: number,
        subject: string,
        topic: string,
        title: string,
        grade: number,
        difficulty: number
    }[]
}

export type FetchQuestionResponse = {
    id: number
    subject: string
    topic: string
    title: string
    grade: number
    difficulty: number
    question: string
    answers: string[]
    image_locations: string[]
}

export type FetchPermissionsResponse = {
    permissions: string
}

export type FetchTopicRecommendationsResponse = {
    recommendations: {
        subject: string,
        topic: string,
        description: string,
        question_id_link: number,
        question_title: string
    }[]
}
