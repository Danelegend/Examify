import { RiHeartFill, RiHeartLine } from 'react-icons/ri';
import { useState } from "react"
import { readAccessToken } from '../../../util/utility';
import { DeleteFavourite, PostFavourite } from '../../../api/api';

const FavouriteIcon = ({ exam_id }: { exam_id: number} ) => {
    const [Favourite, SetFavourite] = useState<boolean>(false)

    const click = () => {
        const token = readAccessToken()

        if (token === null) {
            return
        }

        Favourite ? DeleteFavourite({ exam_id: exam_id, token: token }) : PostFavourite({ exam_id: exam_id, token: token })

        SetFavourite(!Favourite)
    }

    return Favourite ?
        <RiHeartFill size={40} color="red" className="cursor-pointer" onClick={click} />
        :
        <RiHeartLine size={40} color="black" className="cursor-pointer" onClick={click} />
}

export default FavouriteIcon