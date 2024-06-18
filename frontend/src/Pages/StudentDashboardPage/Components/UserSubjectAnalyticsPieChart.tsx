import { useQuery } from "@tanstack/react-query"
import { FetchUserSubjectAnalytics } from "../../../api/api"
import { readAccessToken } from "../../../util/utility"
import { useEffect, useState } from "react"
import { ExamsComplete } from "../../../api/types"
import ApexCharts from 'apexcharts'


const getChartOptions = (CompletedExams: ExamsComplete[]) => {
    return {
      series: CompletedExams.map(x => x.number_complete),
      colors: ["#1C64F2", "#16BDCA", "#FDBA8C", "#E74694"],
      chart: {
        height: 320,
        width: "100%",
        type: "donut",
      },
      stroke: {
        colors: ["transparent"],
        lineCap: "",
      },
      plotOptions: {
        pie: {
          donut: {
            labels: {
              show: true,
              name: {
                show: true,
                fontFamily: "Inter, sans-serif",
                offsetY: 20,
              },
              total: {
                showAlways: true,
                show: true,
                label: "Exams Completed",
                fontFamily: "Inter, sans-serif",
                formatter: function (w) {
                  const sum = w.globals.seriesTotals.reduce((a, b) => {
                    return a + b
                  }, 0)
                  return sum
                },
              },
              value: {
                show: true,
                fontFamily: "Inter, sans-serif",
                offsetY: -20,
                formatter: function (value) {
                  return value
                },
              },
            },
            size: "80%",
          },
        },
      },
      grid: {
        padding: {
          top: -2,
        },
      },
      labels: CompletedExams.map(x => x.subject),
      dataLabels: {
        enabled: false,
      },
      legend: {
        position: "bottom",
        fontFamily: "Inter, sans-serif",
      },
      yaxis: {
        labels: {
          formatter: function (value) {
            return value
          },
        },
      },
      xaxis: {
        labels: {
          formatter: function (value) {
            return value
          },
        },
        axisTicks: {
          show: false,
        },
        axisBorder: {
          show: false,
        },
      },
    }
  }
  
  
  

const SubjectAnalyticsPieChart = () => {
    const [CompletedExams, SetCompletedExams] = useState<ExamsComplete[]>([])

    const {data, isPending} = useQuery({
        queryKey: ["SubjectAnalytics"],
        queryFn: () => FetchUserSubjectAnalytics({ token: readAccessToken()! })
    })

    const loadChart = (exams: ExamsComplete[]) => {
        if (document.getElementById("donut-chart") && typeof ApexCharts !== 'undefined') {
            const chart = new ApexCharts(document.getElementById("donut-chart"), getChartOptions(exams));
            chart.render();
          }
    }

    useEffect(() => {
        if (!isPending) {
          SetCompletedExams(data!.analytics)
          loadChart(data!.analytics)
        }
    }, [isPending, data])

    return (
        <div className="border-2 border-black p-2">
            {
              <div className="py-6" id="donut-chart">
                {
                  (CompletedExams.length > 0) ? null :
                    <div className="flex">
                      <div className="m-auto text-black">
                        <a href="/exams" className="text-black text-sm">No Completed Exams</a>
                      </div>
                    </div>
                }
              </div>
            }
            
        </div>
    )
}

export default SubjectAnalyticsPieChart