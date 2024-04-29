import Environment from "../../constants"
import { FetchError } from "../util/utility"
import { AdminExamReviewDeleteRequest, AdminExamReviewSubmitRequest, ExamUploadRequest, FetchLogosResponse, FetchUserResponse, UserProfileEditRequest, UserRegistrationRequest, UserRegistrationResponse } from "./types"

export type UserAuthentication = {
    refresh_token: string,
    access_token: string
}

export const PostUserRegistration = ({ request }: { request: UserRegistrationRequest }): Promise<Response> => {
    return fetch(Environment.BACKEND_URL + "/api/auth/register", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            first_name: request.first_name,
            last_name: request.last_name,
            email: request.email,
            password: request.password
        }),
        credentials: "include"
    })
}

export const EditUserProfileData = ({ token, request }: { token: string, request: UserProfileEditRequest }): Promise<Response> => {
    return fetch(Environment.BACKEND_URL + "/api/auth/profile", {
        method: "PUT",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `bearer ${token}`
        },
        body: JSON.stringify({
            dob: request.dob.toISOString(),
            school_year: request.school_year,
            school: request.school
        })
    })
}

export const fetchLogos = (): () => Promise<FetchLogosResponse> => {
    return () => fetch(Environment.BACKEND_URL + "/api/logo/", {
        method: "GET",
        credentials: 'include'
    }).then((async (res) => {
        const data = await res.json()

        if (res.ok) {
            return data
        } else {
            throw new FetchError(res)
        }
    }))
}

export const AdminExamReviewSubmit = ({ token, request }: { token: string, request: AdminExamReviewSubmitRequest }): Promise<Response> => {
    return fetch(Environment.BACKEND_URL + "/api/admin/exam/review/submit", {
        headers: {
            "Content-Type": "application/json",
            "Authorization": `bearer ${token}`
        },
        method: "POST",
        credentials: 'include',
        body: JSON.stringify({
            school: request.school,
            exam_type: request.exam_type,
            year: request.year,
            subject: request.subject,
            file_location: request.file_location
        })
    })
}

export const AdminExamReviewDelete = ({ token, request}: { token: string, request: AdminExamReviewDeleteRequest}): Promise<Response> => {
    return fetch(Environment.BACKEND_URL + "/api/admin/exam/review/delete", {
        headers: {
            "Content-Type": "application/json",
            "Authorization": `bearer ${token}`
        },
        method: "DELETE",
        credentials: 'include',
        body: JSON.stringify({
            file_location: request.file_location
        })
    })
}

export const AdminExamCurrentDelete = (token: string, exam_id: number): () => Promise<any> => {
    return () => fetch(Environment.BACKEND_URL + "/api/admin/exam/current/" + exam_id.toString(), {
        headers: {
            "Authorization": `bearer ${token}`
        },
        method: "DELETE",
        credentials: 'include'
    }).then(async (res) => {
        const data = await res.json()

        if (res.ok) {
            return data
        } else {
            throw new FetchError(res)
        }
    })
}

export const PostExamUpload = ({ request }: { request: ExamUploadRequest }): Promise<Response> => {
    const formData = new FormData()

    formData.append("file", request.file)
    formData.append("school", request.school)
    formData.append("year", request.year.toString())        
    formData.append("type", request.type)
    formData.append("grade", request.grade.toString())
    formData.append("subject", request.subject)

    return fetch(Environment.BACKEND_URL + "/api/admin/exam/upload", {
        method: "POST",
        credentials: 'include',
        body: formData
    })
}

export const FetchUserProfile = (token: string): () => Promise<FetchUserResponse> => {
    return () => fetch(Environment.BACKEND_URL + "/api/user/profile", {
        headers: {
            "Authorization": `bearer ${token}`
        },
        method: 'GET',
        credentials: 'include'
    }).then(async (res) => {
        const data = await res.json()

        if (res.ok) {
            return data
        } else {
            throw new FetchError(res)
        }
    })
}
