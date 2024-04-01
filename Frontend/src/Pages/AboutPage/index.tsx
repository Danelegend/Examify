import Faqs from "./Components/Faqs";
import Features from "./Components/Features";
import Hero from "./Components/Hero";

const AboutPage = () => {
    return (
        
        <div>
            <Hero />
            <Features />
            <Faqs />
        </div>
    )

    /*
    return (
        <div className="flex flex-col justify-between gap-y-10">
            <div className="text-white align-middle justify-center mt-4 flex-col gap-y-10 flex">
                <div className="flex flex-col text-center md:mx-72 gap-4">
                    <div className="text-center text-3xl tracking-wide">
                        About Examify 📚
                    </div>
                    <div className="break-normal tracking-normal leading-relaxed text-balance">
                        Welcome to Examify, your go-to destination for accessing past exams and study resources for high school students. At Examify, we're passionate about empowering students to succeed in their academic pursuits by providing them with the tools they need to excel.
                        </div>
                    <div className="text-2xl">
                        Our Mission 🚀
                    </div>
                    <div>
                        Our mission at Examify is simple: to make studying easier, more efficient, and more effective for high school students. We believe that access to past exams and study resources is crucial for academic success, and we're dedicated to making these resources readily available to all students, regardless of their background or circumstances.
                    </div>
                    <div className="text-2xl">
                        What We Offer 🎓
                    </div>
                    <div>
                        Examify is a comprehensive platform where students can find a wide range of past exams, study guides, practice questions, and more. Whether you're preparing for your final exams, standardized tests, or simply looking to reinforce your learning, Examify has you covered.
                    </div>
                    <div className="text-2xl">
                        Why Choose Examify? ✨
                    </div>
                    <div className="">
                        <ul>
                            <li>
                                Quality Resources: We curate our content carefully to ensure that every resource on Examify is accurate, relevant, and high-quality.
                            </li>
                            <li>
                                Accessibility: Examify is designed to be accessible to students from all walks of life. Our platform is user-friendly and easy to navigate, making it simple for students to find the resources they need quickly and efficiently.
                            </li>
                            <li>
                                Community-driven: We believe in the power of collaboration and community. Examify is built on the contributions of students, teachers, and educators who share their knowledge and expertise to help others succeed.
                            </li>
                            <li>
                                Constant Improvement: We're always striving to improve Examify and add new features and resources to better serve our users. Your feedback is essential in helping us shape the future of Examify and make it the best it can be.
                            </li>
                        </ul>
                    </div>
                    <div className="text-2xl">
                        Get Involved 🌟
                    </div>
                    <div>
                        Join the Examify community today and take your studying to the next level! Whether you're a student looking for resources or an educator interested in contributing, there's a place for you here at Examify.
                    </div>
                    <div>
                        Thank you for choosing Examify. Together, let's make learning easier and more accessible for students everywhere.
                    </div>
                </div>

            </div>
        </div>
    ) */
}

export default AboutPage;