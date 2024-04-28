import { useEffect, useState } from "react";
import Environment from "../../../../constants";
import { FetchError } from "../../../util/utility";
import { useQuery } from "@tanstack/react-query";
import SchoolLogoCard from "./SchoolLogoCard";
import useScript from "../../../hooks/useScript";
import { fetchLogos } from "../../../api/api";

const doubleArray = (arr: any[]) => {
    return arr.concat(arr)
}

const SchoolLogoCarousel = ({ className }: { className: string}) => {
    const [Images, SetImages] = useState<string[]>([]);

    useScript("//unpkg.com/alpinejs")

    const { data, isPending, error } = useQuery({
        queryKey: ["Images"],
        queryFn: fetchLogos(),
    })

    useEffect(() => {
        if (error) {
            if (error instanceof FetchError) {
                switch((error as FetchError).status) {
                    case 500:
                        break
                    default:
                        break
                }
            }
        }

        if (!isPending) {
            SetImages(data!.logos)
        }
    }, [error, isPending])

    return (
    <div x-data="{}"
            x-init="$nextTick(() => {
                let ul = $refs.logos;
                ul.insertAdjacentHTML('afterend', ul.outerHTML);
                ul.nextSibling.setAttribute('aria-hidden', 'true');
            })"
            className={className + " w-full inline-flex flex-nowrap overflow-hidden [mask-image:_linear-gradient(to_right,transparent_0,_black_128px,_black_calc(100%-128px),transparent_100%)]"} >
        <ul x-ref="logos" className="flex items-center justify-center md:justify-start [&_li]:mx-8 [&_img]:max-w-none animate-infinite-scroll">
            {
                doubleArray(Images).map((image, index) => {
                    return (
                        <li key={index}>
                            <SchoolLogoCard logo={Environment.BACKEND_URL + "/api/logo/" + image} schoolName={image} />
                        </li>
                    )
                })
            }
        </ul>
    </div> 
    )
}

export default SchoolLogoCarousel;