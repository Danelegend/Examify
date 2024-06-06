import { useState } from "react";
import { TiTickOutline, TiTick } from "react-icons/ti";
import { readAccessToken } from "../../../util/utility";
import { DeleteCompletedExam, PostCompletedExam } from "../../../api/api";

const CompleteIcon = ({ exam_id }: { exam_id: number }) => {
    const [Complete, SetComplete] = useState<boolean>(false)

    const click = () => {
        const token = readAccessToken()

        if (token === null) {
            return
        }

        Complete ? DeleteCompletedExam({ exam_id: exam_id, token: token }) : PostCompletedExam({ exam_id: exam_id, token: token })
        SetComplete(!Complete)
    }

    return (
        Complete ?
        <TiTick size={48} color="green" className="cursor-pointer" onClick={click}/>
        :
        <TiTickOutline size={48} color="black" className="cursor-pointer" onClick={click} />
    )
}

export default CompleteIcon