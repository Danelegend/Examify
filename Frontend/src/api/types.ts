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

export type UserRegistrationRequest = {
    first_name: string,
    last_name: string,
    email: string,
    password: string
}

// RESPONSES

export type SignUpResponse = {
    status: number,
    message: string,
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