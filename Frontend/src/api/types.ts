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