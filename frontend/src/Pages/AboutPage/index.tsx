import { Helmet } from "react-helmet-async";
import Faqs from "./Components/Faqs";
import Features from "./Components/Features";
import Hero from "./Components/Hero";

const AboutPage = () => {
    return (
        <div>
            <Helmet>
                <title>Examify | Comprehensive Study Tool for the HSC and Trials</title>
                <meta name="description" content="Examify is the most comprehensive platform for your HSC. We provide the LARGEST collection of Questions, Exams, HSC and Trial papers to assist with your HSC studies."/>
            </Helmet>
            <Hero />
            <Features />
            <Faqs />
        </div>
    )
}

export default AboutPage;