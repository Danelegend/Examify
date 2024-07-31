import { Helmet } from "react-helmet-async"


type BlogCardType = {
    title: string,
    image: string,
    blurb: string,
    link: string
}

type BlogDisplayProps = {
    blogs: BlogCardType[]
}

type SectionTitleProps = {
    title: string,
    description: string,
    link: string
}

const blogs: BlogCardType[] = [
    {
        title: "Maths Advanced: A 4 Week Guide to a Band 6",
        image: "https://www.school-news.com.au/wp-content/uploads/2019/08/AdobeStock_216539624.jpg",
        blurb: "We understand that year 12 is the time to have fun. But with Trials and HSC right around the corner, it's time to lock in. Here's our 4 week study path to help you ace Maths Advanced and give you the best shot at a Band 6.",
        link: "/blog/maths-advanced-4-week-guide"
    }
]

const BlogsPage = () => {
    return (
        <div className="min-h-screen justify-center flex flex-col w-full">
            <Helmet>
                <title>Examify | Blogs</title>
                <meta name="description" content="Examify is the most comprehensive platform for your HSC. We provide the LARGEST collection of Questions, Exams, HSC and Trial papers to assist with your HSC studies."/>
            </Helmet>
            <Banner />
            <div className="mx-auto">
                <BlogDisplay blogs={blogs}/>
            </div>  
        </div>
    )
}

const Banner = () => {
    return (
        <div className="relative overflow-hidden bg-blue-300  max-w-full">
            <div className="container flex min-h-[24rem] items-center sm:px-10 md:px-20 mx-auto">
                <div className="flex flex-col gap-8 py-12 sm:py-20">
                    <div className="flex flex-col gap-4 sm:gap-6">
                        <h1 className="max-w-[20ch] leading-[1.1] text-white [text-wrap:balance] font-bold">
                            Articles
                        </h1>
                        <p className="max-w-[40ch] font-light text-white [text-wrap:balance] xs:text-xl sm:text-2xl">
                            Read our subject guides, study tips, and more, written by top ranking graduates.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    )
}

const BlogDisplay = ({ blogs }: BlogDisplayProps) => {
    return (
        <div className="container my-16 flex flex-col gap-4 sm:px-10 md:px-20 md:max-w-7xl mx-auto max-w-full">
            <SectionDisplay />
        </div>
    )
}

const SectionDisplay = () => {
    return (
        <div>
            <div className="grid gap-4 xs:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
                <SectionTitle title={"Headline Articles"} description={"Project's most popular posts, collated based on quality of content, and practical advice."} link={""}/>
                <MainBlogCard blog={blogs[0]} />
            </div>
        </div>
    )
}

const SectionTitle = ({ title, description, link }: SectionTitleProps) => {
    return (
        <div className="flex flex-col gap-4 sm:col-span-full md:w-1/2">
            <h2 className="text-2xl font-semibold">
                {title}
            </h2>
            <p className="text-pretty">
                {description}
            </p>
            <a href={link} className="font-bold text-blue-700 hover:text-blue-500">
                Read More →
            </a>
        </div>
    )
}

const MainBlogCard = ({ blog }: { blog: BlogCardType }) => {
    return (
        <a href={blog.link} className="h-full border border-solid border-slate-200 rounded-xl col-span-full hidden grid-cols-2 gap-4 bg-white shadow sm:grid">
            <img src={blog.image} className="aspect-video h-full w-full bg-slate-300 object-cover object-top rounded-none rounded-l-xl" loading="lazy"/>
            <div className="flex flex-col justify-between gap-2 p-4">
                <div className="flex flex-col gap-3">
                    <div className="flex flex-col gap-2">
                        <p className="text-3xl font-semibold">
                            {blog.title}
                        </p>
                        <p className="text-lg text-slate-600">
                            {blog.blurb}
                        </p>
                    </div>
                </div>
            </div>
        </a>
    )
}

const BlogCard = ({ blog }: { blog: BlogCardType }) => {
    return (
        <div>
            <div>
                <img src={blog.image} alt={blog.title} />
            </div>
            <div>
                <h2>
                    {blog.title}
                </h2>
                <p>
                    {blog.blurb}
                </p>
            </div>
        </div>
    )
}

export default BlogsPage