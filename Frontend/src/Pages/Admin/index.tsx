import { ReactNode } from "react"
import { useNavigate } from "react-router-dom"

const PageButton = ({ children, className, onClick }: { children: ReactNode, className?: string, onClick?: () => void }) => {
    return (
        <div className={`text-slate-800 font-medium cursor-pointer rounded-lg border bg-blue-200 px-6 py-2 ${className}`} onClick={onClick}>
            {children}
        </div>
    )
}

const AdminPage = () => {
    const navigate = useNavigate()

    const CurrentExamsButtonClick = () => {
        navigate("/admin/exams/current")
    }

    const ReviewExamsButtonClick = () => {
        navigate("/admin/exams/review")
    }

    return (
        <div className="text-center">
            <h1 className="text-slate-100">Admin Page</h1>
            <div className="flex justify-center space-x-24 mt-64">
                <PageButton onClick={CurrentExamsButtonClick}>
                    Current Exams
                </PageButton>
                <PageButton onClick={ReviewExamsButtonClick}>
                    Review Exams
                </PageButton>
            </div>
        </div>
    )
}

export default AdminPage