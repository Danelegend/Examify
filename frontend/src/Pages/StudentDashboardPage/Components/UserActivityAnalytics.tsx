import { useState } from "react"

type UserActivityAnalytics = {
    date: Date
    completed_exams: {
        subject: string,
        number_complete: number
    }[]
}

const ActivityAnalyticsDisplay = () => {
    const PERIOD = 7
    const TODAY = new Date()
    
    const [UserActivityAnalytics, SetUserActivityAnalytics] = useState<UserActivityAnalytics[]>([])

    return (
        <div className="col-span-4">
            <div id="line-chart" />
        </div>
    )
}

export default ActivityAnalyticsDisplay