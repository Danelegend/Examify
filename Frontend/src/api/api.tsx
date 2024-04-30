import Environment from "../../constants"
import { FetchError, readExpiration, storeAccessToken, storeExpiration } from "../util/utility"
import { AdminExamReviewDeleteRequest, AdminExamReviewSubmitRequest, ExamUploadRequest, FetchExamsRequest, FetchExamsResponse, FetchExamSubjectsResponse, FetchFavouriteExamsResponse, FetchLogosResponse, FetchRecentExamsResponse, FetchSchoolsResponse, FetchUserResponse, UserLoginRequest, UserProfileEditRequest, UserRegistrationRequest, UserRegistrationResponse } from "./types"

export type UserAuthentication = {
    expiration: Date,
    access_token: string
}

type AuthorizationMiddlewareType = <T,>(func: () => Promise<T>) => Promise<T>

const AuthorizationMiddleware: AuthorizationMiddlewareType = (func) => {
    // If the token has expired, refresh it
    if (readExpiration() === null || new Date(readExpiration()!) <= new Date()) {
        return fetch(Environment.BACKEND_URL + "/api/auth/refresh", {
            method: "GET",
            credentials: "include"
        }).then(async (res) => {
            const data: UserAuthentication = await res.json()

            if (res.ok) {
                storeAccessToken(data.access_token)
                storeExpiration(data.expiration)

                return func()
            } else {
                throw new FetchError(res)
            }
        })
    }
    
    return func()
}

export const GetTokenRefresh = (): Promise<Response> => {
    return fetch(Environment.BACKEND_URL + "/api/auth/refresh", {
        method: "GET",
        credentials: "include"
    })
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

export const PostUserSignIn = ({ request }: { request: UserLoginRequest }): Promise<Response> => {
    return fetch(Environment.BACKEND_URL + "/api/auth/login", {
        headers: {
            'Content-Type': 'application/json'
        },
        method: "POST",
        body: JSON.stringify({
            email: request.email,
            password: request.password
        }),
        credentials: 'include'
    })
}

export const UserLogout = ({ token }: { token: string }): Promise<Response> => {
    return fetch(Environment.BACKEND_URL + "/api/auth/logout", {
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `bearer ${token}`
        },
        method: "DELETE",
        credentials: 'include'
    })
}

export const EditUserProfileData = ({ token, request }: { token: string, request: UserProfileEditRequest }): Promise<Response> => {
    return AuthorizationMiddleware<Response>(() => fetch(Environment.BACKEND_URL + "/api/auth/profile", {
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
    }))
}

export const FetchLogos = (): Promise<FetchLogosResponse> => {
    return fetch(Environment.BACKEND_URL + "/api/logo/", {
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
    return AuthorizationMiddleware<Response>(() => fetch(Environment.BACKEND_URL + "/api/admin/exam/review/submit", {
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
    }))
}

export const AdminExamReviewDelete = ({ token, request}: { token: string, request: AdminExamReviewDeleteRequest}): Promise<Response> => {
    return AuthorizationMiddleware<Response>(() => fetch(Environment.BACKEND_URL + "/api/admin/exam/review/delete", {
        headers: {
            "Content-Type": "application/json",
            "Authorization": `bearer ${token}`
        },
        method: "DELETE",
        credentials: 'include',
        body: JSON.stringify({
            file_location: request.file_location
        })
    }))
}

export const AdminExamCurrentDelete = ({ token, exam_id }: { token: string, exam_id: number }): Promise<Response> => {
    return AuthorizationMiddleware<Response>(() => fetch(Environment.BACKEND_URL + "/api/admin/exam/current/" + exam_id.toString(), {
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
    }))
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

export const FetchUserProfile = ({ token }: { token: string }): Promise<FetchUserResponse> => {
    return AuthorizationMiddleware<FetchUserResponse>(() => fetch(Environment.BACKEND_URL + "/api/user/profile", {
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
    }))
}

export const FetchExams = ({ token, request }: { token: string | null, request: FetchExamsRequest }): Promise<FetchExamsResponse> => {
    return fetch(Environment.BACKEND_URL + "/api/exams/", {
        headers: (token === null) ?
        {  
            'Content-Type': 'application/json',
        } :
        {
            'Content-Type': 'application/json',
            "Authorization": `bearer ${token}`
        },
        method: "POST",
        body: JSON.stringify({
            page: request.page,
            filter: request.filter
        }),
        credentials: 'include'
    }).then(async (res) => {
        const data = await res.json()
        
        if (res.ok) {
            return data
        } else {
            throw new FetchError(res, "Bad")
        }
    })
}

export const FetchExamSubjects = (): Promise<FetchExamSubjectsResponse> => {
    return fetch(Environment.BACKEND_URL + "/api/exams/subjects", {
        headers: 
        {  
            'Content-Type': 'application/json',
        },
        method: "GET",
        credentials: 'include'
    }).then(async (res) => {
        const data = await res.json()

        if (res.ok) {
            return data
        } else {
            throw new FetchError(res, "Bad")
        }
    })
}

export const FetchSchools = (): Promise<FetchSchoolsResponse> => {
    return fetch(Environment.BACKEND_URL + "/api/exams/schools", {
        headers: 
        {  
            'Content-Type': 'application/json',
        },
        method: "GET",
        credentials: 'include'
    }).then(async (res) => {
        const data = await res.json()

        if (res.ok) {
            return data
        } else {
            throw new FetchError(res, "Bad")
        }
    })
}

export const PostFavourite = ({ token, exam_id }: { token: string, exam_id: number }): Promise<Response> => {
    return AuthorizationMiddleware<Response>(() => fetch(Environment.BACKEND_URL + "/api/exam/" + exam_id.toString() + "/favourite", {
        headers: {
            'Content-Type': 'application/json',
            "Authorization": `bearer ${token}`
        },
        method: "POST",
        body: JSON.stringify({
            exam_id: exam_id
        }),
        credentials: 'include'
    }))
}

export const DeleteFavourite = ({ token, exam_id }: { token: string, exam_id: number }): Promise<Response> => {
    return AuthorizationMiddleware<Response>(() => fetch(Environment.BACKEND_URL + "/api/exam/" + exam_id.toString() + "/favourite", {
        headers: {
            'Content-Type': 'application/json',
            "Authorization": `bearer ${token}`
        },
        body: JSON.stringify({
            exam_id: exam_id
        }),
        method: "DELETE",
        credentials: 'include'
    }))
}

export const FetchFavouriteExams = ({ token }: { token: string }): Promise<FetchFavouriteExamsResponse> => {
    return AuthorizationMiddleware<FetchFavouriteExamsResponse>(() => fetch(Environment.BACKEND_URL + "/api/exams/favourites", {
        headers: {
            'Content-Type': 'application/json',
            "Authorization": `bearer ${token}`
        },
        method: "GET",
        credentials: 'include'
    }).then(async (res) => {
        const data = await res.json()

        if (res.ok) {
            return data
        } else {
            throw new FetchError(res)
        }
    }))
}

export const FetchRecentExams = ({ token }: { token: string }): Promise<FetchRecentExamsResponse> => {
    return AuthorizationMiddleware<FetchRecentExamsResponse>(() => fetch(Environment.BACKEND_URL + "/api/exams/recents", {
        headers: {
            'Content-Type': 'application/json',
            "Authorization": `bearer ${token}`
        },
        method: "GET",
        credentials: 'include'
    }).then(async (res) => {
        const data = await res.json()

        if (res.ok) {
            return data
        } else {
            throw new FetchError(res)
        }
    }))
}

export const PostGoogleSignIn = ({ google_token }: { google_token: string }): Promise<Response> => {
    return fetch(Environment.BACKEND_URL + "/api/auth/login/google", {
        headers: {
            'Content-Type': 'application/json'
        },
        method: "POST",
        credentials: 'include',
        body: JSON.stringify({
            google_token: google_token
        })
    })
}

export const PostFacebookSignIn = ({ facebook_token }: { facebook_token: string }): Promise<Response> => {
    return fetch(Environment.BACKEND_URL + "/api/auth/login/facebook", {
        headers: {
            'Content-Type': 'application/json'
        },
        method: "POST",
        credentials: 'include',
        body: JSON.stringify({
            facebook_token: facebook_token
        })
    })
}
