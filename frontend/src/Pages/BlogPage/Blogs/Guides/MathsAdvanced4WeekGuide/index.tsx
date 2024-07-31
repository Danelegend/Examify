import BlogExamCard from "../../Components/BlogExamCard"
import { InView, useInView } from "react-intersection-observer"
import * as React from "react"
import { Helmet } from "react-helmet-async"

type Navigation = {
    sectionName: string,
    sectionPath: string,
}

type NavigatorProps = {
    navigations: Navigation[],
    idInView: string
}

type StructureProps = {
    children: React.ReactNode,
    navigations: Navigation[]
}

type BannerProps = {
    link: string
}

const Banner = ({ link }: BannerProps) => {
    return (
        /*<div className="rounded-lg bg-blue-300 object-cover size-full max-w-[75ch] lg:max-w-full max-h-80 min-h-[24rem] w-full">

        </div>*/
        <img src={link} className="rounded-lg bg-slate-100 object-cover size-full max-w-[75ch] lg:max-w-full max-h-80 w-full" />
    )
}

const Navigator = ({ navigations, idInView }: NavigatorProps) => {
    return (
        <nav className="toc sticky top-0 overflow-y-auto h-screen scrollbar-hide min-w-40 order-2 hidden py-8 max-h-full lg:block">
            <div className="border-2 rounded-xl shadow-md">
                <h5 className="pl-4 text-xl font-semibold">
                    On this page
                </h5>
                <ul className="flex list-none flex-col gap-2 p-4 text-gray-600 xl:text-lg"> 
                    <li> 
                        <a href="#_top" className={"group " + ((idInView === "_top") ? "text-blue-600" : "text-gray-500")}> 
                            <span className="absolute -left-1.5 hidden group-data-[toc-active=true]:block">
                                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-chevron-right size-5 mt-1">
                                    <path d="m9 18 6-6-6-6" />
                                </svg>
                            </span> 
                            Overview 
                        </a>  
                    </li>
                    {
                        navigations.map((navigation, index) => {
                            return (
                                <li key={index}> 
                                    <a href={navigation.sectionPath} className={"group " + ((idInView === navigation.sectionPath.slice(1)) ? "text-blue-600" : "text-gray-500")}> 
                                        <span className="absolute -left-1.5 hidden group-data-[toc-active=true]:block">
                                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-chevron-right size-5 mt-1">
                                                <path d="m9 18 6-6-6-6" />
                                            </svg>
                                        </span> 
                                        {(index + 1).toString() + "."} {navigation.sectionName}
                                    </a>  
                                </li>
                            )
                        })
                    }
                </ul> 
            </div>
        </nav>
    )
}

const Structure = ({ children, navigations }: StructureProps) => {
    const { ref, inView } = useInView({
        threshold: 0.8,
    });

    const [visibleSection, setVisibleSection] = React.useState("_top");

    const setInView = (inView, entry) => {
        if (inView) {
            setVisibleSection(entry.target.getAttribute("id"));
        }
    }

    const wrapSectionsForInView = (children: React.ReactNode) => {
        return React.Children.map(children, (child, index) => {
            if (React.isValidElement(child) && child.props.id) {

                return (
                    <InView onChange={setInView} threshold={0.8} key={index} id={child.props.id} initialInView={true}>
                        {child}
                    </InView>
                )
            } else if (React.isValidElement(child) && child.props.children) {
                return React.cloneElement(child, {
                    children: wrapSectionsForInView(child.props.children)
                })
            } else {
                return child
            }
        })
    }

    const memoChildren = React.useMemo(() => wrapSectionsForInView(children), [children])

    return (
        <main className="mx-auto mb-12 mt-4 flex max-w-5xl flex-col items-center gap-8 px-4 sm:gap-10 sm:px-6">
            <Banner link={"https://www.school-news.com.au/wp-content/uploads/2019/08/AdobeStock_216539624.jpg"}/>
            <div className="flex items-start gap-14">
                <Navigator navigations={navigations} idInView={visibleSection}/>
                <div className="flex max-w-[75ch] flex-col gap-8 " ref={ref}>
                    {memoChildren}
                </div>
            </div>
        </main>
    )
}

const MathsAdvanced4WeekGuide = () => {
    return (
        <Structure navigations={[{
            sectionName: "Introduction",
            sectionPath: "#introduction"
        }, {
            sectionName: "Our Approach",
            sectionPath: "#our_approach"
        }, {
            sectionName: "Week 1 - Early Days",
            sectionPath: "#week_1"
        }, {
            sectionName: "Week 2 - Getting Better",
            sectionPath: "#week_2"
        }, {
            sectionName: "Week 3 - The Race Begins",
            sectionPath: "#week_3"
        }, {
            sectionName: "Week 4 - All Out",
            sectionPath: "#week_4"
        }, {
            sectionName: "Tips for Success",
            sectionPath: "#tips_for_success"
        }, {
            sectionName: "Conclusion",
            sectionPath: "#conclusion"
        }]}>
            <Helmet>
                <title>Examify | Maths Advanced: A 4 Week Guide to a Band 6</title>
                <meta name="description" content="Many students aim for a Band 6 in Maths Advanced, but it's also essential to enjoy your final year of high school. Studies show that effective study methods can yield similar results in half the time. With Trials and the HSC around the corner, our 4-week study path helps you ace Maths Advanced while leaving you more time for fun."/>
            </Helmet>
            <article className="flex flex-col justify-between gap-y-8 font-sans tracking-normal leading-loose">
                <section id="_top">
                    <h1 className="text-3xl md:text-5xl md:leading-tight md:tracking-tight font-bold"> 
                        Maths Advanced: A 4 Week Guide to a Band 6
                    </h1>
                    <div className="mt-4 italic">
                        <p className="italic text-xs">Published 31/07/2024</p>
                    </div>
                </section>
                <section className="flex flex-col gap-y-8" id="introduction">
                    <h2 className="font-bold text-4xl">
                        Introduction
                    </h2>  
                    <p>
                        Many students aim for a Band 6 in Maths Advanced, but it's also essential to enjoy your final year of high school. Studies show that effective study methods can yield similar results in half the time. With trials and the HSC around the corner, our 4-week study path helps you ace Maths Advanced while leaving you more time for fun.
                    </p>
                </section>
                <section className="flex flex-col gap-y-4" id="our_approach">
                    <h2 className="font-bold text-4xl">
                        Our Approach
                    </h2>
                    <p>
                        We recognize that each student has unique study needs. Through our experience, we’ve found that hands-on practice consistently produces the best results. Given the limited time, it’s more effective to tackle questions and learn through practice rather than revisiting tedious theory. Just like in sports, the most significant improvements come from practice, not just reading about techniques.
                    </p>
                    <p>
                        A crucial part of this method is <b>self-marking</b>. After completing an exam, always mark it yourself, noting mistakes and areas for improvement. This prevents the reinforcement of incorrect methods. 
                    </p>
                    <p>
                        Our general strategy is:
                    </p>
                    <ol className="list-decimal ml-20">
                        <li>Take a practice exam.</li>
                        <li>Attempt each question and mark any you cannot answer.</li>
                        <li>Mark your exam and understand the solutions.</li>
                        <li>Review and revise any content you don't understand.</li>
                        <li>Reattempt any questions you got wrong.</li>
                    </ol>
                    <p>
                        This approach integrates theory learning with practical application, allowing for faster progress within a short timeframe.
                    </p>
                </section>
                <section className="flex flex-col gap-y-4" id="week_1">
                    <h2 className="font-bold text-4xl">
                        Week 1 - Early Days
                    </h2>
                    <p className="">
                        The first few days might be challenging, but that’s part of the learning process. Initially, we recommend taking exams in a relaxed environment rather than under strict exam conditions. This will help you get comfortable with answering questions. 
                    </p>
                    <p className="">
                        To start, try these exams:
                    </p>
                    <ol className="list-decimal ml-20">
                        <li>Killara 2020</li>
                        <li>Glenwood 2023</li>
                        <li>Penrith 2023</li>
                    </ol>
                    <div className="grid grid-cols-3 gap-x-4 my-8">
                        <div>
                            <BlogExamCard school="Killara" year={2020} type="Trial" subject={"Maths Advanced"} />
                        </div>
                        <div>
                            <BlogExamCard school="Glenwood" year={2023} type="Trial" subject={"Maths Advanced"} />
                        </div>
                        <div>
                            <BlogExamCard school="Penrith" year={2023} type="Trial" subject={"Maths Advanced"} />
                        </div>
                    </div>
                </section>
                <section className="flex flex-col gap-y-4" id="week_2">
                    <h2 className="font-bold text-4xl">
                        Week 2 - Getting Better
                    </h2>
                    <p>
                        With the initial exams complete, you should have a better understanding of the basics. Now it’s time to tackle more complex problems. Continue taking exams in a relaxed setting to build your confidence and familiarity with the material. 
                    </p>
                    <p className="">
                        We suggest these intermediate-level exams:   
                    </p>
                    <ol className="list-decimal ml-20">
                        <li>Riverview 2023</li>
                        <li>Baulkham Hills 2022</li>
                        <li>Moriah College 2021</li>
                    </ol>
                    <div className="grid grid-cols-3 gap-x-4 my-8">
                        <div>
                            <BlogExamCard school="Riverview" year={2023} type="Trial" subject={"Maths Advanced"} />
                        </div>
                        <div>
                            <BlogExamCard school="Baulkham Hills" year={2022} type="Trial" subject={"Maths Advanced"} />
                        </div>
                        <div>
                            <BlogExamCard school="Moriah" year={2021} type="Trial" subject={"Maths Advanced"} />
                        </div>
                    </div>
                </section>
                <section className="flex flex-col gap-y-4" id="week_3">
                    <h2 className="font-bold text-4xl">
                        Week 3 - The Race Begins
                    </h2>
                    <p>
                        Now, it's time to introduce timed exams. Start by taking an exam without worrying about the clock to establish a benchmark for how long you take. Then, move on to timed practice. Set a 3-hour timer and aim to complete the exam within this period. 
                    </p>
                    <p className="">
                        Here are some exams to try: 
                    </p>
                    <ol className="list-decimal ml-20">
                        <li>Blacktown Boys 2023</li>
                        <li>Knox 2023</li>
                        <li>Abbotsleigh 2021</li>
                    </ol>
                    <div className="grid grid-cols-3 gap-x-4 my-8">
                        <div>
                            <BlogExamCard school="Blacktown Boys" year={2023} type="Trial" subject={"Maths Advanced"} />
                        </div>
                        <div>
                            <BlogExamCard school="Knox" year={2023} type="Trial" subject={"Maths Advanced"} />
                        </div>
                        <div>
                            <BlogExamCard school="Abbotsleigh" year={2021} type="Trial" subject={"Maths Advanced"} />
                        </div>
                    </div>
                </section>
                <section className="flex flex-col gap-y-4" id="week_4">
                    <h2 className="font-bold text-4xl">
                        Week 4 - All Out
                    </h2>
                    <p>
                        In this final week, focus on refining your skills and timing. Continue taking timed exams and review your performance meticulously. Concentrate on any remaining weak areas and ensure you understand every mistake. This will be crucial for your final preparations and confidence on exam day.
                    </p>
                    <p className="">
                        Give these exams a shot under timed conditions:
                    </p>
                    <ol className="list-decimal ml-20">
                        <li>Sydney Grammar 2023</li>
                        <li>North Sydney Boys 2021</li>
                        <li>James Ruse 2023</li>
                    </ol>
                    <div className="grid grid-cols-3 gap-x-4 my-8">
                        <div>
                            <BlogExamCard school="Sydney Grammar" year={2023} type="Trial" subject={"Maths Advanced"} />
                        </div>
                        <div>
                            <BlogExamCard school="North Sydney Boys" year={2021} type="Trial" subject={"Maths Advanced"} />
                        </div>
                        <div>
                            <BlogExamCard school="James Ruse" year={2023} type="Trial" subject={"Maths Advanced"} />
                        </div>
                    </div>
                </section>
                <section className="flex flex-col gap-y-8" id="tips_for_success">
                    <h2 className="font-bold text-4xl">
                        Tips for Success
                    </h2>
                    <ol className="list-disc ml-4">
                        <li><b>Consistent Practice</b>: Regular practice is essential for mastering Maths Advanced.</li>
                        <li><b>Seek Help</b>: Don’t hesitate to ask teachers or peers for help when needed.</li>
                        <li><b>Utilize Resources</b>: Examify's resources provide a wide range of material to help study.</li>
                        <li><b>Study Analytics</b>: Examify's analytics provide insight to where your study can be improved.</li>
                        <li><b>Stay Positive</b>: Maintain a positive attitude and believe in your ability to succeed.</li>
                    </ol>
                    <p>
                        With dedication and a structured approach, you can achieve a Band 6 in Maths Advanced. Follow this guide, adapt it to your needs, and keep pushing towards your goal. Good luck!
                    </p>
                </section>
                <section className="flex flex-col gap-y-8"  id="conclusion">
                    <h2 className="font-bold text-4xl">
                        Conclusion
                    </h2>
                    <p>
                        We hope this guide provides you with a clear path to excel in your Maths Advanced exams. But remember, your journey to mastering the HSC doesn't end here. The key to achieving top marks lies in continuous practice and focused study. <b>Examify</b> is dedicated to supporting you every step of the way.
                    </p>
                    <p>
                        With Examify, you gain access to a vast library of past papers across various subjects, from Maths Extension 2 to Chemistry and Economics. You can also find additional questions tailored to specific topics, ensuring comprehensive preparation. Our detailed analytics help you pinpoint areas for improvement, optimizing your study sessions.
                    </p>
                    <p className="text-center">
                        Maximize your potential and ace your exams by signing up for Examify today! Join us and take the first step towards achieving your academic goals with confidence and ease.
                    </p>
                </section>
            </article>
        </Structure>
    )
}

export default MathsAdvanced4WeekGuide