import {RiHeartFill} from 'react-icons/ri';
import useWindowSize from "../../../hooks/useWindowSize";

type FavouriteIconProps = {
    isFavourite: boolean,
    onClick: (e: Event) => void,
    className: string
}

const FavouriteIcon = ({ isFavourite, onClick, className }: FavouriteIconProps) => {
    const size = useWindowSize()

    return isFavourite ? 
        <RiHeartFill size={size.width > 1080 ? 32 : 16} className={className} onClick={onClick} color="red"/>
        :
        <RiHeartFill size={size.width > 1080 ? 32 : 16} className={className} onClick={onClick} color="white" />
}

export default FavouriteIcon;