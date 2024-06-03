import { useEffect, useRef, useState } from "react"

type ButtonProps = {
    title: string
    onClick: () => void
}

type Time = {
    second: number
    minute: number
    hour: number
}

const getPaddedNumber = (num: number) => {
    var num_string = num.toString()

    if (num_string.length < 2) num_string = '0' + num_string;

    return num_string
}

const parseNumber = (input: string, type: 's' | 'm' | 'h') => {
    // Rules for number parsing are:
    // 1. Remove any leading 0's
    // 2. May only contain numbers

    if (!/^\d+$/.test(input)) return 0

    let res = parseInt(input)

    if (type === 's' || type === 'm') {
        return (res < 60) ? res : 0 
    }

    return res
}

const isZeroTime = (time: Time) => {
    return time.second === 0 && time.minute === 0 && time.hour === 0
}

const Timer = () => {
    const [Time, SetTime] = useState<Time>({
        second: 10,
        minute: 0,
        hour: 0
    })

    const [TimerRunning, SetRunTimer] = useState<boolean>(false)

    const inputTime = useRef<Time>({
        second: 0,
        minute: 0,
        hour: 0
    })


    const countDown = () => {
        // Decrease time by 1
        const secondsRemaining = Time.second + Time.minute * 60 + Time.hour * 60 * 60

        if (secondsRemaining <= 0) stopCountDown()

        const secs = secondsRemaining - 1;

        let hours = Math.floor(secs / (60 * 60));

        let divisor_for_minutes = secs % (60 * 60);
        let minutes = Math.floor(divisor_for_minutes / 60);

        let divisor_for_seconds = divisor_for_minutes % 60;
        let seconds = Math.ceil(divisor_for_seconds);

        SetTime({
            second: seconds,
            minute: minutes,
            hour: hours
        })
    }

    const startCountDown = () => {
        if (!TimerRunning && !isZeroTime(Time)) {
            SetRunTimer(true)
        }
    }

    const stopCountDown = () => {
        SetRunTimer(false)
    }

    const resetTimer = () => {
        SetRunTimer(false)
        SetTime(inputTime.current)
    }

    const editHour = (e) => {
        const val = {...Time, hour: parseNumber(e.target.value, 'h')}

        SetTime(val)
        inputTime.current = val
    }

    const editMinute = (e) => {
        const val = {...Time, minute: parseNumber(e.target.value, 'm')}

        SetTime(val)
        inputTime.current = val
    }

    const editSecond = (e) => {
        const val = {...Time, second: parseNumber(e.target.value, 's')}

        SetTime(val)
        inputTime.current = val
    }

    useEffect(() => {
        if (!TimerRunning) return

        const timer = window.setInterval(() => countDown(), 1000)
        
        return () => window.clearInterval(timer)
    }, [TimerRunning, Time])

    return (
        <div className="space-y-2 flex flex-col">
            <div className="border-4 border-black rounded-sm text-black text-xl">
                <div className="flex flex-shrink px-4 py-2 justify-center">
                    {
                        (TimerRunning) ? 
                        <>
                        <div className="">
                            {getPaddedNumber(Time.hour)}
                        </div>
                        :
                        <div>
                            {getPaddedNumber(Time.minute)}
                        </div>
                        :
                        <div>
                            {getPaddedNumber(Time.second)}
                        </div>
                        </>
                        :
                        <>
                        <input value={getPaddedNumber(Time.hour)} className="flex text-black bg-slate-100 w-10 text-center" onChange={editHour}/> 
                        :
                        <input value={getPaddedNumber(Time.minute)} className="text-black bg-slate-100 w-10 text-center" onChange={editMinute}/>
                        :
                        <input value={getPaddedNumber(Time.second)} className="text-black bg-slate-100 w-10 text-center" onChange={editSecond}/>
                        </>
                    }
                </div>
            </div>
            <div className="flex space-x-2 justify-center">
                {
                    (TimerRunning) ?
                    <>
                        <Button title={"Pause"} onClick={stopCountDown}/>
                        <Button title={"Reset"} onClick={resetTimer}/>
                    </>
                    :
                    <>
                        <Button title={"Start"} onClick={startCountDown}/>
                        <Button title={"Reset"} onClick={resetTimer}/>
                    </>
                }
                
            </div>
        </div>
    )
}

const Button = ({ title, onClick }: ButtonProps) => {
    return (
        <button className="border-black" onClick={onClick}>
            <div className="text-black">
                {title}
            </div>
        </button>
    )
}

export default Timer