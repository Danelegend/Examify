import { Helmet } from "react-helmet-async";
import Faqs from "./Components/Faqs";
import Features from "./Components/Features";
import Hero from "./Components/Hero";

const AboutPage = () => {
    return (
        <div>
            <Helmet>
                <title>Examify | Comprehensive HSC Study Platform</title>
                <meta name="description" content="The most comprehensive platform for HSC students to access past papers, study resources, and more! We provide the BIGGEST collection of HSC and Trial papers with features to best assist your HSC studies."/>
            </Helmet>
            <Hero />
            <Features />
            <Faqs />
        </div>
    )
}

export default AboutPage;