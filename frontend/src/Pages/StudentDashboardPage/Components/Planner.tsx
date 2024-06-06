import { useState } from "react"

type Event = {
    title: string,
    description: string,
    date: Date,
    complete: boolean
}

type PlannerDateProps = {
    date: Date,
    events: Event[]
}

type PlannerItemProps = {
    event: Event
}

const Planner = () => {
    const [Events, SetEvents] = useState<Event[]>([
        {
            title: "Math Exam",
            description: "For Advanced stuff",
            date: new Date(),
            complete: false
        }
    ])

    const Days = []

    for (var i = 0; i < 10; ++i) {
        Days.push(new Date((new Date()).setDate((new Date()).getDate() + i)))
    }

    return (
        <div className="border-2 border-black bg-yellow-100">
            <ul>
                {
                    Days.map((date, index) => {
                        return (
                            <li key={index}>
                                <PlannerDate date={date} events={Events.filter(event => event.date.getDate() == date.getDate())}/>
                            </li>
                        )
                    })
                }
            </ul>
        </div>
    )
}

const PlannerDate = ({ date, events }: PlannerDateProps) => {
    return (
        <div>
            <div className="flex justify-between text-black px-4 border-gray-500 border-b">
                <div className="my-2">
                    {date.toDateString()}
                </div>
                <div>
                    +
                </div>
            </div>
            {
                events.map(event => <PlannerItem event={event} />)
            }
        </div>
    )
}

const PlannerItem = ({ event }: PlannerItemProps) => {
    const [Complete, SetComplete] = useState<boolean>(event.complete)

    const MarkComplete = () => {
        SetComplete(!Complete)
    }

    return (
        <div className="flex text-black justify-between cursor-pointer border-gray-500 border-b" onClick={MarkComplete}>
            <div className={(Complete ? "line-through " : "") + "ml-8"}>
                <div className="text-base">
                    {event.title}
                </div>
                <div className="text-sm">
                    {event.description}
                </div>
            </div>
        </div>
    )
}

export default Planner