import SchoolLogoCard from "./SchoolLogoCard";
import useScript from "../../../hooks/useScript";

const doubleArray = (arr: any[]) => {
    return arr.concat(arr)
}

const GetSchoolLogos = () => {
    return [
        "school_logos/grammar.png",
        "school_logos/knox.png",
        "school_logos/manly.png",
        "school_logos/nsb.png",
        "school_logos/nsg.png",
        "school_logos/ruse.png",
        "school_logos/sb.png",
        "school_logos/sg.png",
    ]
}

const SchoolLogoCarousel = ({ className }: { className: string}) => {
    useScript("//unpkg.com/alpinejs")

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
                doubleArray(GetSchoolLogos()).map((image, index) => {
                    return (
                        <li key={index}>
                            <SchoolLogoCard logo={window.location.origin + '/' + image} schoolName={image} />
                        </li>
                    )
                })
            }
        </ul>
    </div> 
    )
}

export default SchoolLogoCarousel;