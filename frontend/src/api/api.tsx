import Environment from "../../constants"
import { FetchError, readAccessToken, readExpiration, removeAccessToken, storeAccessToken, storeExpiration } from "../util/utility"
import { AdminExamReviewDeleteRequest, AdminExamReviewSubmitRequest, ExamUpdateRequest, ExamUploadRequest, FeedbackRequest, FetchExamResponse, FetchExamsRequest, FetchExamsResponse, FetchExamSubjectsResponse, FetchFavouriteExamsResponse, FetchLogosResponse, FetchNotificationsResponse, FetchPermissionsResponse, FetchQuestionResponse, FetchQuestionsRequest, FetchQuestionsResponse, FetchQuestionSubjectsResponse, FetchQuestionTopicsResponse, FetchRecentExamsResponse, FetchRecommendedExamsResponse, FetchRegisteredUsersResponse, FetchSchoolsResponse, FetchTopicRecommendationsResponse, FetchUserActivityAnalyticsResponse, FetchUserResponse, FetchUserSubjectAnalyticsResponse, PostQuestionRequest, PostUserQuestionAnswerRequest, RefreshTokenResponse, SignInResponse, SignOutResponse, SignUpResponse, UserLoginRequest, UserProfileEditRequest, UserRegistrationRequest } from "./types"

export type UserAuthentication = {
    expiration: Date,
    access_token: string
}

type AuthorizationMiddlewareType = <T,>(func: () => Promise<T>) => Promise<T>

const AuthorizationMiddleware: AuthorizationMiddlewareType = (func) => {
    // If the token has expired, refresh it
    if (readExpiration() === null || new Date(readExpiration()!) <= new Date()) {
        return GetTokenRefresh().then((data) => {
            storeAccessToken(data.access_token);
            storeExpiration(data.expiration);

            return func()
        })
    }
    
    return func()
}

export const GetTokenRefresh = (): Promise<RefreshTokenResponse> => {
    return fetch(Environment.BACKEND_URL + "/api/auth/refresh", {
        method: "GET",
        credentials: "include"
    }).then(async (res) => {
        if (res.ok && res.status === 200) {
            const data = await res.json()

            return data
        } else {
            removeAccessToken()
            throw new FetchError(res)
        }
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

export const UserLogout = (): Promise<Response> => {
    return fetch(Environment.BACKEND_URL + "/api/auth/logout", {
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `bearer ${readAccessToken()}`
        },
        method: "DELETE",
        credentials: 'include'
    })
}

export const EditUserProfileData = ({ request }: { request: UserProfileEditRequest }): Promise<Response> => {
    return AuthorizationMiddleware<Response>(() => fetch(Environment.BACKEND_URL + "/api/auth/profile", {
        method: "PUT",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `bearer ${readAccessToken()}`
        },
        body: JSON.stringify({
            dob: request.dob.toISOString(),
            school_year: request.school_year,
            school: request.school,
            subjects: request.subjects
        })
    }))
}

export const FetchPermissions = (): Promise<FetchPermissionsResponse> => {
    return AuthorizationMiddleware<FetchPermissionsResponse>(() => fetch(Environment.BACKEND_URL + "/api/auth/permissions", {
        headers: {
            "Authorization": `bearer ${readAccessToken()}`
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

export const AdminExamReviewSubmit = ({ request }: { request: AdminExamReviewSubmitRequest }): Promise<Response> => {
    return AuthorizationMiddleware<Response>(() => fetch(Environment.BACKEND_URL + "/api/admin/exam/review/submit", {
        headers: {
            "Content-Type": "application/json",
            "Authorization": `bearer ${readAccessToken()}`
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

export const AdminExamReviewDelete = ({ request}: { request: AdminExamReviewDeleteRequest}): Promise<Response> => {
    return AuthorizationMiddleware<Response>(() => fetch(Environment.BACKEND_URL + "/api/admin/exam/review/delete", {
        headers: {
            "Content-Type": "application/json",
            "Authorization": `bearer ${readAccessToken()}`
        },
        method: "DELETE",
        credentials: 'include',
        body: JSON.stringify({
            file_location: request.file_location
        })
    }))
}

export const AdminExamCurrentDelete = ({ exam_id }: { exam_id: number }): Promise<Response> => {
    return AuthorizationMiddleware<Response>(() => fetch(Environment.BACKEND_URL + "/api/admin/exam/current/" + exam_id.toString(), {
        headers: {
            "Authorization": `bearer ${readAccessToken()}`
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

export const AdminFetchRegisteredUsers = (): Promise<FetchRegisteredUsersResponse> => {
    return AuthorizationMiddleware<FetchRegisteredUsersResponse>(() => fetch(Environment.BACKEND_URL + "/api/admin/users", {
        headers: {
            "Authorization": `bearer ${readAccessToken()}`
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

export const FetchUserProfile = (): Promise<FetchUserResponse> => {
    return AuthorizationMiddleware<FetchUserResponse>(() => fetch(Environment.BACKEND_URL + "/api/user/profile", {
        headers: {
            "Authorization": `bearer ${readAccessToken()}`
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

export const FetchExams = ({ request }: { request: FetchExamsRequest }): Promise<FetchExamsResponse> => {
    console.log(request.filter.schools)
    return fetch(`${Environment.BACKEND_URL}/api/exams/?page=${request.page}&page_length=${request.page_length}`, {
        headers: (readAccessToken() === null) ?
        {  
            'Content-Type': 'application/json',
        } :
        {
            'Content-Type': 'application/json',
            "Authorization": `bearer ${readAccessToken()}`
        },
        method: "POST",
        body: JSON.stringify({
            filter: {
                schools: request.filter.schools,
                subjects: request.filter.subjects,
                years: request.filter.years,   
            },
            sort: request.sort
        }),
        credentials: 'include'
    }).then(async (res) => {
        const data = await res.json()
        
        console.log(request.filter.schools, data.exams[0])

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

export const PostFavourite = ({ exam_id }: { exam_id: number }): Promise<Response> => {
    return AuthorizationMiddleware<Response>(() => fetch(Environment.BACKEND_URL + "/api/exam/" + exam_id.toString() + "/favourite", {
        headers: {
            'Content-Type': 'application/json',
            "Authorization": `bearer ${readAccessToken()}`
        },
        method: "POST",
        body: JSON.stringify({
            exam_id: exam_id
        }),
        credentials: 'include'
    }))
}

export const DeleteFavourite = ({ exam_id }: { exam_id: number }): Promise<Response> => {
    return AuthorizationMiddleware<Response>(() => fetch(Environment.BACKEND_URL + "/api/exam/" + exam_id.toString() + "/favourite", {
        headers: {
            'Content-Type': 'application/json',
            "Authorization": `bearer ${readAccessToken()}`
        },
        body: JSON.stringify({
            exam_id: exam_id
        }),
        method: "DELETE",
        credentials: 'include'
    }))
}

export const FetchFavouriteExams = (): Promise<FetchFavouriteExamsResponse> => {
    return AuthorizationMiddleware<FetchFavouriteExamsResponse>(() => fetch(Environment.BACKEND_URL + "/api/exams/favourites", {
        headers: {
            'Content-Type': 'application/json',
            "Authorization": `bearer ${readAccessToken()}`
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

export const FetchRecentExams = (): Promise<FetchRecentExamsResponse> => {
    return AuthorizationMiddleware<FetchRecentExamsResponse>(() => fetch(Environment.BACKEND_URL + "/api/exams/recents", {
        headers: {
            'Content-Type': 'application/json',
            "Authorization": `bearer ${readAccessToken()}`
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

export const FetchRecommendedExams = (): Promise<FetchRecommendedExamsResponse> => {
    return AuthorizationMiddleware<FetchRecommendedExamsResponse>(() => fetch(`${Environment.BACKEND_URL}/api/exams/recommended`, {
        headers: {
            'Content-Type': 'application/json',
            "Authorization": `bearer ${readAccessToken()}`
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

export const PostRecentlyViewedExam = ({ exam_id }: { exam_id: number }): Promise<Response> => {
    return AuthorizationMiddleware<Response>(() => fetch(Environment.BACKEND_URL + "/api/exam/" + exam_id.toString() + "/recent", {
        headers: {
            'Content-Type': 'application/json',
            "Authorization": `bearer ${readAccessToken()}`
        },
        method: "POST",
        credentials: 'include'
    }))
}

export const FetchExam = ({ school, year, exam_type, subject }: { school: string, year: number, exam_type: string, subject: string }): Promise<FetchExamResponse> => {
    return fetch(`${Environment.BACKEND_URL}/api/exam/${subject}/${school}/${year.toString()}/${exam_type}`, {
        headers: {
            'Content-Type': 'application/json',
        },
        method: "GET",
        credentials: 'include'
    }).then(async (res) => {
        if (res.status === 404) {
            return null
        }
        
        const data = await res.json()

        if (res.ok && res.status === 200)     {
            return data
        }  else {
            throw new FetchError(res)
        }
    })
}

export const FetchUserNotifications = (): Promise<FetchNotificationsResponse> => {
    return AuthorizationMiddleware<FetchNotificationsResponse>(() => fetch(Environment.BACKEND_URL + "/api/user/notifications", {
        headers: {
            'Content-Type': 'application/json',
            "Authorization": `bearer ${readAccessToken()}`
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

export const UserNotificationsSeen = ({ notification_ids }: { notification_ids: number[] }): Promise<Response> => {
    return AuthorizationMiddleware<Response>(() => fetch(Environment.BACKEND_URL + "/api/user/notifications/seen", {
        method: "PUT",
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `bearer ${readAccessToken()}`
        },
        body: JSON.stringify({
            notifications: notification_ids
        })
    }))
}

export const PostCompletedExam = ({ exam_id }: { exam_id: number }): Promise<Response> => {
    return AuthorizationMiddleware<Response>(() => fetch(Environment.BACKEND_URL + "/api/exam/" + exam_id.toString() + "/complete", {
        headers: {
            'Content-Type': 'application/json',
            "Authorization": `bearer ${readAccessToken()}`
        },
        method: "POST",
        credentials: 'include'
    }))
}

export const DeleteCompletedExam = ({ exam_id }: { exam_id: number}): Promise<Response> => {
    return AuthorizationMiddleware<Response>(() => fetch(Environment.BACKEND_URL + "/api/exam/" + exam_id.toString() + "/complete", {
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `bearer ${readAccessToken()}`
        },
        method: "DELETE",
        credentials: 'include'
    }))
} 

export const FetchUserSubjectAnalytics = (): Promise<FetchUserSubjectAnalyticsResponse> => {
    return AuthorizationMiddleware<FetchUserSubjectAnalyticsResponse>(() => fetch(Environment.BACKEND_URL + "/api/user/analytics/subject", {
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `bearer ${readAccessToken()}`
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

export const FetchUserActivityAnalytics = (): Promise<FetchUserActivityAnalyticsResponse> => {
    return AuthorizationMiddleware<FetchUserActivityAnalyticsResponse>(() => fetch(Environment.BACKEND_URL + "/api/user/analytics/activity", {
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `bearer ${readAccessToken()}`
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

export const FetchUserCompletedExam = ({ exam_id }: { exam_id: number }): Promise<Boolean> => {
    return AuthorizationMiddleware<Boolean>(() => fetch(Environment.BACKEND_URL + "/api/exam/" + exam_id.toString() + "/complete", {
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `bearer ${readAccessToken()}`
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

export const FetchUserFavouritedExam = ({ exam_id }: { exam_id: number }): Promise<Boolean> => {
    return AuthorizationMiddleware<Boolean>(() => fetch(Environment.BACKEND_URL + "/api/exam/" + exam_id.toString() + "/favourite", {
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `bearer ${readAccessToken()}`
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

export const FetchQuestions = ({ request }: { request: FetchQuestionsRequest }): Promise<FetchQuestionsResponse> => {
    return fetch(Environment.BACKEND_URL + "/api/questions/?page=" + request.page.toString() + "&page_length=" + request.page_length.toString(), {
        headers: ( readAccessToken() === null ? 
        {
            'Content-Type': 'application/json'
        }
        :
        {
            'Content-Type': 'application/json',
            'Authorization': `bearer ${readAccessToken()}`
        }),
        method: "POST",
        credentials: 'include',
        body: JSON.stringify({
            filter: request.filter
        })
    }).then(async (res) => {
        const data = await res.json()

        if (res.ok && res.status === 200) {
            return data
        } else {
            throw new FetchError(res, "Bad")
        }
    })
}

export const FetchQuestionSubjects = (): Promise<FetchQuestionSubjectsResponse> => {
    return fetch(Environment.BACKEND_URL + "/api/questions/subjects", {
        headers: 
        {  
            'Content-Type': 'application/json',
        },
        method: "GET",
        credentials: 'include'
    }).then(async (res) => {
        const data = await res.json()

        if (res.ok && res.status === 200) {
            return data
        } else {
            throw new FetchError(res, "Bad")
        }
    })
}

export const FetchQuestionTopics = (): Promise<FetchQuestionTopicsResponse> => {
    return fetch(Environment.BACKEND_URL + "/api/questions/topics", {
        headers: 
        {  
            'Content-Type': 'application/json',
        },
        method: "GET",
        credentials: 'include'
    }).then(async (res) => {
        const data = await res.json()

        if (res.ok && res.status === 200) {
            return data
        } else {
            throw new FetchError(res, "Bad")
        }
    })
}

export const FetchQuestion = ({ question_id }: { question_id: number }): Promise<FetchQuestionResponse> => {
    return fetch(Environment.BACKEND_URL + "/api/question/" + question_id.toString(), {
        headers: 
        {  
            'Content-Type': 'application/json',
        },
        method: "GET",
        credentials: 'include'
    }).then(async (res) => {
        const data = await res.json()

        if (res.ok && res.status === 200) {
            return data
        } else {
            throw new FetchError(res, "Bad")
        }
    })
}

export const PostUserQuestionAnswer = ({ request }: { request: PostUserQuestionAnswerRequest}): Promise<Response> => {
    return AuthorizationMiddleware<Response>(() => fetch(Environment.BACKEND_URL + "/api/question/" + request.question_id.toString() + "/answer", {
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `bearer ${readAccessToken()}`
        },
        method: "POST",
        credentials: 'include',
        body: JSON.stringify({
            question_id: request.question_id,
            answer: request.answer
        })
    }))
}

export const PostQuestion = ({ request }: { request: PostQuestionRequest }): Promise<Response> => {
    return AuthorizationMiddleware<Response>(() => fetch(`${Environment.BACKEND_URL}/api/question/`, {
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `bearer ${readAccessToken()}`
        },
        method: "POST",
        credentials: 'include',
        body: JSON.stringify({
            title: request.title,
            subject: request.subject,
            topic: request.topic,
            grade: request.grade,
            difficulty: request.difficulty,
            question: request.question,
            answers: request.answers,
            images: []
        })
    }))
}

export const PutExamUpdate = ({ request }: { request: ExamUpdateRequest }): Promise<Response> => {
    return AuthorizationMiddleware<Response>(() => fetch(`${Environment.BACKEND_URL}/api/admin/exam/${request.exam_id}`, {
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `bearer ${readAccessToken()}`
        },
        method: "PUT",
        credentials: 'include',
        body: JSON.stringify({
            school: request.school,
            year: request.year,
            exam_type: request.exam_type,
            subject: request.subject
        })
    }))
}

export const FetchTopicRecommendations = (): Promise<FetchTopicRecommendationsResponse> => {
    return AuthorizationMiddleware<FetchTopicRecommendationsResponse>(() => fetch(`${Environment.BACKEND_URL}/api/user/recommendations/topic`, {
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `bearer ${readAccessToken()}`
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

export const PostFeedback = ({ request }: { request: FeedbackRequest }): Promise<Response> => {
    return fetch(`${Environment.BACKEND_URL}/api/admin/feedback`, {
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `bearer ${readAccessToken()}`
        },
        method: "POST",
        credentials: 'include',
        body: JSON.stringify({
            name: request.name,
            email: request.email,
            feedback: request.feedback
        })
    })
}