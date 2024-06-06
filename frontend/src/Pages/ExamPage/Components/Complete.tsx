import { useEffect, useState } from "react";
import { TiTickOutline, TiTick } from "react-icons/ti";
import { readAccessToken } from "../../../util/utility";
import { DeleteCompletedExam, FetchUserCompletedExam, PostCompletedExam } from "../../../api/api";
import { useQuery } from "@tanstack/react-query";

const CompleteIcon = ({ exam_id }: { exam_id: number }) => {
    const [Complete, SetComplete] = useState<boolean>(false)

    const { data, isPending, isError } = useQuery({
        queryKey: ['Complete'],
        queryFn: () => FetchUserCompletedExam({ token: readAccessToken()!, exam_id: exam_id }),
        retry: 0
    })

    const click = () => {
        const token = readAccessToken()

        if (token === null) {
            return
        }

        Complete ? DeleteCompletedExam({ exam_id: exam_id, token: token }) : PostCompletedExam({ exam_id: exam_id, token: token })
        SetComplete(!Complete)
    }

    useEffect(() => {
        if (isError) {
            SetComplete(false)
            return
        }

        if (!isPending) {
            SetComplete(data!.valueOf())
        }
    }, [isPending, isError])

    return (
        Complete ?
        <TiTick size={48} color="green" className="cursor-pointer" onClick={click}/>
        :
        <TiTickOutline size={48} color="black" className="cursor-pointer" onClick={click} />
    )
}

export default CompleteIcon