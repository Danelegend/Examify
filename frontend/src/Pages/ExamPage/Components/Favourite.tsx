import { RiHeartFill, RiHeartLine } from 'react-icons/ri';
import { useEffect, useState } from "react"
import { readAccessToken } from '../../../util/utility';
import { DeleteFavourite, FetchUserFavouritedExam, PostFavourite } from '../../../api/api';
import { useQuery } from '@tanstack/react-query';

const FavouriteIcon = ({ exam_id }: { exam_id: number} ) => {
    const [Favourite, SetFavourite] = useState<boolean>(false)

    const { data, isPending, isError } = useQuery({
        queryKey: ['Favourite'],
        queryFn: () => FetchUserFavouritedExam({ token: readAccessToken()!, exam_id: exam_id}),
        retry: 0
    })

    const click = () => {
        const token = readAccessToken()

        if (token === null) {
            return
        }

        Favourite ? DeleteFavourite({ exam_id: exam_id, token: token }) : PostFavourite({ exam_id: exam_id, token: token })

        SetFavourite(!Favourite)
    }

    useEffect(() => {
        if (isError) {
            SetFavourite(false)
            return
        }

        if (!isPending) {
            SetFavourite(data!.valueOf())
        }
    }, [isPending, isError])

    return Favourite ?
        <RiHeartFill size={40} color="red" className="cursor-pointer" onClick={click} />
        :
        <RiHeartLine size={40} color="black" className="cursor-pointer" onClick={click} />
}

export default FavouriteIcon