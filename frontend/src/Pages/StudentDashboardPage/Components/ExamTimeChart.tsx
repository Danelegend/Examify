import { useEffect, useState } from "react"
import ApexCharts from 'apexcharts'
import { useQuery } from "@tanstack/react-query"
import { FetchUserActivityAnalytics } from "../../../api/api"
import { readAccessToken } from "../../../util/utility"

type View = "daily" | "tri-daily" | "weekly" | "fortnightly"

type ExamTimeStats = {
    date: Date,
    numExams: number,
}

type ViewBucket = {
    startDate: Date,
    endDate: Date,
    numExams: number
}

const getViewDays = (view: View) => {
    switch (view) {
        case "daily":
            return 1
        case "tri-daily":
            return 3
        case "weekly":
            return 7
        case "fortnightly":
            return 14
        default:
            throw new Error("Invalid view")
    }
}

const getChartOptions = (stats: ViewBucket[], size: number) => {
    return {
        series: [
            {
                name: "Exams",
                data: stats.map((stat) => {
                    return {
                        x: stat.startDate.toLocaleDateString('en-GB', {
                            day: '2-digit',
                            month: 'short'
                        }),
                        y: stat.numExams
                    }
                })
            }
        ],
        title: {
            text: "Exams Study Progress",
            align: "center",
            style: {
                fontSize: "22px",
                fontFamily: "sans-serif"
            }
        },
        chart: {
            height: 320,
            type: "line",
            zoom: {
                enabled: false
            },
            toolbar: false
        },
        stroke: {
            curve: "straight"
        },
        xaxis: {
            type: "category",
            categories: stats.map((stat) => {
                return stat.startDate.toDateString()
            }),
            tickPlacement: "on",
            stepSize: size
        },
        yaxis: {
            type: "numeric",
            stepSize: 1
        }
    }
}

const createDate = (): Date => {
    const temp = new Date()

    return new Date(temp.getFullYear(), temp.getMonth(), temp.getDate())
}

const createViewBuckets = (stats: ExamTimeStats[], view: View, numBuckets: number): ViewBucket[] => {
    /*
    *   Given the stats, we want to put the stats into view buckets
    *   Returns a list of View Buckets sorted by start date
    */
    // Map of start date to view bucket
    var map = new Map<number, ViewBucket>()

    // Create numBuckets buckets
    for (var i = 0; i < numBuckets; i++) {
        // Bucket start date is the end date is today - i * view and start date is end date - view
        const tempDate = new Date()

        const startDate = new Date(tempDate.getFullYear(), tempDate.getMonth(), tempDate.getDate() - (i + 1) * getViewDays(view) + 1)
        const endDate = new Date(tempDate.getFullYear(), tempDate.getMonth(), tempDate.getDate() - i * getViewDays(view))

        map.set(startDate.getTime(), {
            startDate: startDate,
            endDate: endDate,
            numExams: 0
        })
    }

    stats.forEach((stat) => {
        // Get the start date of the view bucket
        const startDate = getStartDateOfBucket(stat.date, view, map)

        if (map.has(startDate.getTime())) {
            map.get(startDate.getTime())!.numExams += stat.numExams
        } 
    })

    // Order by start date
    const sorted = Array.from(map.values()).sort((a: ViewBucket, b: ViewBucket) => a.startDate.getTime() - b.startDate.getTime())

    return sorted
}

const getEndDateOfBucket = (date: Date, view: View): Date => {
    switch (view) {
        case "daily":
            return date
        case "tri-daily":
            return new Date(date.getFullYear(), date.getMonth(), date.getDate() + 3)
        case "weekly":
            return new Date(date.getFullYear(), date.getMonth(), date.getDate() + 7)
        case "fortnightly":
            return new Date(date.getFullYear(), date.getMonth(), date.getDate() + 14)
        default:
            throw new Error("Invalid view")
    }
}

const getStartDateOfBucket = (date: Date, view: View, map: Map<number, ViewBucket>): Date => {
    switch (view) {
        case "daily":
            return date
        case "tri-daily":
        case "weekly":
        case "fortnightly":
            for (let i = 0; i < getViewDays(view); i++) {
                const tempDate = new Date(date.getFullYear(), date.getMonth(), date.getDate() - i)
                if (map.has(tempDate.getTime())) {
                    return tempDate
                }
            }

            return date
        default:
            throw new Error("Invalid view")
        
    }
}

const ExamTimeChart = () => {
    const [View, SetView] = useState<View>("daily")
    const [UserCompletionStats, SetUserCompletionStats] = useState<ExamTimeStats[]>([])

    const num_buckets = 7

    const { data, isPending } = useQuery({
        queryKey: ["Analytics", "UserCompletionStats"],
        queryFn: () => FetchUserActivityAnalytics({ token: readAccessToken()! })
    })

    const loadChart = (buckets: ViewBucket[]): ApexCharts | null => {
        if (document.getElementById("line-chart") && typeof ApexCharts !== 'undefined') {
            const chart = new ApexCharts(document.getElementById("line-chart"), getChartOptions(buckets, getViewDays(View)));
            chart.render();
            return chart
        }

        return null
    }

    const lineChart = loadChart(createViewBuckets(UserCompletionStats, View, num_buckets))

    useEffect(() => {
        const buckets = createViewBuckets(UserCompletionStats, View, num_buckets)
        
        if (lineChart) {
            lineChart.updateOptions(getChartOptions(buckets, num_buckets), true)
        }

    }, [View, UserCompletionStats])

    useEffect(() => {
        if (!isPending) {
            SetUserCompletionStats(data!.analytics.map((stat) => {
                const temp = new Date(stat.date)

                return {
                    date: new Date(temp.getFullYear(), temp.getMonth(), temp.getDate()),
                    numExams: stat.exams_complete
                }
            }))
        }
    }, [isPending, data])

    return (
        <div className="border-2 border-black p-2">
            <div>
                <div id="line-chart"/>
                <div className="flex justify-center space-x-4">
                    {
                        Array.from(["daily", "tri-daily", "weekly", "fortnightly"]).map((view) => {
                            return (
                                <button onClick={() => SetView(view as View)} key={view}
                                    className={((view === View) ? "bg-blue-500 text-white" : "bg-blue-300 hover:bg-blue-400 text-blue-900") + " "}>
                                    {view.charAt(0).toUpperCase() + view.slice(1)}
                                </button>
                            )
                        })
                    }
                </div>
            </div>
        </div>
    )
}

export default ExamTimeChart