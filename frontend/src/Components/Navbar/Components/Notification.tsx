import { useQuery } from "@tanstack/react-query"
import { useEffect, useRef, useState } from "react"
import { IoIosNotifications } from "react-icons/io"
import { FetchError, handle403, readAccessToken } from "../../../util/utility"
import { FetchUserNotifications, UserNotificationsSeen } from "../../../api/api"
import { useOnClickOutside } from "usehooks-ts"

type Notifications = {
    id: number
    title: string
    message: string
}

const NotificationIcon = ({ className }: { className?: string}) => {
    const [Notifications, SetNotifications] = useState<Notifications[]>([])
    const [toggleDropDown, SetToggleDropdown] = useState<boolean>(false)

    const ref = useRef(null);

    const AuthenticationError = handle403()

    useOnClickOutside(ref, () => SetToggleDropdown(false))

    const { data, isPending, isError, error } = useQuery({
        queryKey: ["Notifications"],
        queryFn: () => FetchUserNotifications({ token: readAccessToken()! })
    })

    useEffect(() => {
        if (error instanceof FetchError) {
            if ((error as FetchError).status === 401) {
                AuthenticationError()
                return
            }
        }

        if (!isPending && !isError) {
            SetNotifications(data!.notifications.sort((a, b) => 
                a.date_sent.getTime() - b.date_sent.getTime()
            ).map(notification => {
                return {
                    id: notification.id,
                    title: notification.title,
                    message: notification.message
                }
            }))
        }
    }, [isPending, error])

    const onNotificationButtonClick = () => {
        SetToggleDropdown(!toggleDropDown)

        if (Notifications.length > 0) {
            UserNotificationsSeen({ 
                token: readAccessToken()!, 
                notification_ids: Notifications.map(notification => notification.id)
            })
        }
    }

    return (
        <div ref={ref}>
            <div className={((className !== undefined) ? className : "") + " cursor-pointer relative"}
                onClick={onNotificationButtonClick}>
                <IoIosNotifications size={20} color={'black'}/>
                {
                    (Notifications.length > 0) ?
                    <div className="absolute bg-red-600 rounded-full w-2 h-2 bottom-0 right-0" />
                    : null
            }
            </div>
            <div className={(toggleDropDown ? "" : "hidden ") + "mt-2 absolute z-10 w-32 bg-slate-50"}>
                <ul className="space-y-1">
                    {
                        (Notifications.length > 0) ? 
                        Notifications.map((notification, index) => {
                            return (
                                <li key={index} className="text-black shadow">
                                    <div className="font-semibold">
                                        {notification.title}
                                    </div>
                                    <div>
                                        {notification.message}
                                    </div>
                                </li>
                            )
                        }) :
                        <li className="text-black shadow-sm text-sm py-2 px-4">
                            No new notifications
                        </li>
                    }
                </ul>
            </div>
        </div>
    )
}

export default NotificationIcon