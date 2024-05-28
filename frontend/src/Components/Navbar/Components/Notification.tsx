import { useState } from "react"
import { IoIosNotifications } from "react-icons/io"

type Notifications = {
    title: string
    message: string
}

const NotificationIcon = ({ className }: { className?: string}) => {
    const [Notifications, SetNotifications] = useState<Notifications[]>([])

    return (
        <div className={((className !== undefined) ? className : "") + " cursor-pointer relative"}>
            <IoIosNotifications size={20} color={'black'}/>

            {
                (Notifications.length > 0) ?
                <div className="absolute bg-red-600 rounded-full w-2 h-2 bottom-0 right-0" />
                : null
            }   
        </div>
    )
}

export default NotificationIcon