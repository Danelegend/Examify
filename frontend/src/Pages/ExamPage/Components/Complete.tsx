import { useContext, useEffect, useState } from "react";
import { TiTickOutline, TiTick } from "react-icons/ti";
import { readAccessToken } from "../../../util/utility";
import { DeleteCompletedExam, FetchUserCompletedExam, PostCompletedExam } from "../../../api/api";
import { useQuery } from "@tanstack/react-query";
import { ModalContext } from "../../../context/modal-context";

const CompleteIcon = ({ exam_id }: { exam_id: number }) => {
    const [Complete, SetComplete] = useState<boolean>(false)
    
    const { SetDisplayLogin } = useContext(ModalContext)

    const { data, isPending, isError } = useQuery({
        queryKey: ['Complete'],
        queryFn: () => {
            if (readAccessToken() === null) {
                return new Promise<boolean>((resolve, reject) => {
                    resolve(false)
                })
            }

            return FetchUserCompletedExam({ exam_id: exam_id })
        },
        retry: 0
    })

    const click = () => {
        const token = readAccessToken()

        if (token === null) {
            SetDisplayLogin(true)
            return
        }

        Complete ? DeleteCompletedExam({ exam_id: exam_id }) : PostCompletedExam({ exam_id: exam_id })
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