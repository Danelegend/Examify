import { useEffect, useState } from "react"
import backgroundImage from '../../../images/background-features.jpg'

import examsImage from '../../../images/screenshots/exams.jpg'
import questionsImage from '../../../images/screenshots/questions.jpg'
import analyticsImage from '../../../images/screenshots/analytics.jpg'
import tutorImage from '../../../images/screenshots/tutor.jpg'
import comingSoonImage from '../../../images/screenshots/coming_soon.jpg'

type Feature = {
    title: string,
    description: string,
    image: string,
    alt: string
}

const Features = () => {
    const features: Feature[] = [
        {
          title: "Past Exams & Practice Questions",
          description: "Access the largest collection of previous HSC exams, past trial papers, and question banks designed to help you master every topic.",
          image: examsImage,
          alt: "Practice Trial Exams"
        },
        {
          title: "Analytics",
          description: "Track your progress and see where and how you can improve with our advanced analytics tools.",
          image: analyticsImage,
          alt: "HSC Study Analytics"
        },
        {
          title: "Ai Tutor",
          description: "Get 24/7 feedback or assistance with Ai Tutor technology, trained on custom HSC datasets to provide fast and accurate results.",
          image: tutorImage,
          alt: "Ai Tutor"
        },
        {
          title: "Custom Exam Generation",
          description: "Generate custom exams tailored to your needs and wants.",
          image: comingSoonImage,
          alt: "Custom Exam Generation"
        }
    ]

    const [tabOrientation, setTabOrientation] = useState<string>('horizontal')
    const [activeFeatureIndex, setActiveFeatureIndex] = useState<number>(0)


    useEffect(() => {
      const lgMediaQuery = window.matchMedia('(min-width: 1024px)')

      function onMediaQueryChange({ matches }: { matches: boolean}) {
        setTabOrientation(matches ? 'vertical' : 'horizontal')
      }

      onMediaQueryChange(lgMediaQuery)
      lgMediaQuery.addEventListener('change', onMediaQueryChange)

      return () => {
        lgMediaQuery.removeEventListener('change', onMediaQueryChange)
      }
    }, [])

    return (
      <section
        id="features"
        aria-labelledby="features-title"
        className="relative overflow-hidden bg-blue-600 pt-20 pb-28 sm:py-32"
      >
        <div className="absolute top-0 left-0 overflow-hidden">
          <img 
            src={backgroundImage}
            alt="background"
            width={2245}
            height={1636}
          />
        </div>
        <div className="relative mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
          <div className="max-w-2xl md:mx-auto md:text-center xl:max-w-none">
            <h2
              id="features-title"
              className="font-display text-3xl tracking-tight text-white sm:text-4xl md:text-5xl"
            >
              Everything you need to master your HSC
            </h2>
            <p className="mt-6 text-lg tracking-tight text-blue-100">
              Well everything except that half decent sleep schedule
            </p>
          </div>
          <div
            className="mt-16 grid grid-cols-1 items-center gap-y-2 pt-10 sm:gap-y-6 md:mt-20 lg:grid-cols-12 lg:pt-0">
              <>
                <div className="-mx-4 flex overflow-x-auto pb-4 sm:mx-0 sm:overflow-visible sm:pb-0 lg:col-span-5">
                  <div className="relative z-10 flex space-x-4 whitespace-nowrap px-4 sm:mx-auto sm:px-0 lg:mx-0 lg:block lg:space-x-0 lg:whitespace-normal">
                    {features.map((feature, featureIndex) => (
                      <div
                        key={featureIndex}
                        onClick={() => setActiveFeatureIndex(featureIndex)}
                        className={
                          ((activeFeatureIndex === featureIndex) ? 'lg:ring-1 bg-white/10 lg:bg-white/10' : 'hover:bg-white/5 lg:hover:bg-white/5') + 
                            ' group relative rounded-full py-1 px-4 lg:rounded-r-none lg:rounded-l-xl lg:p-6 lg:hover:ring-1 lg:ring-inset lg:ring-white/10 cursor-pointer font-display'
                        }
                      >
                        <h3>
                          <div
                            className={
                              'text-lg [&:not(:focus-visible)]:focus:outline-none text-blue-100 hover:text-white lg:text-white'
                          }
                          >
                            <span className="absolute inset-0 rounded-full lg:rounded-r-none lg:rounded-l-xl" />
                            {feature.title}
                          </div>
                        </h3>
                        <p
                          className={((activeFeatureIndex === featureIndex) ? 'text-white' : 'text-blue-100' ) + ' mt-2 hidden text-sm lg:block hover:text-white'
                          }
                        >
                          {feature.description}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
                <div className="lg:col-span-7">
                  {features.map((feature) => (
                    <div key={feature.title} >
                      <div className="relative sm:px-6 lg:hidden">
                        <div className="absolute -inset-x-4 -top-[6.5rem] -bottom-[4.25rem] bg-white/10 ring-1 ring-inset ring-white/10 sm:inset-x-0 sm:rounded-t-xl" />
                        <p className="relative mx-auto max-w-2xl text-base text-white sm:text-center">
                          {feature.description}
                        </p>
                      </div>
                    </div>
                  ))}
                  <div className="relative mt-10 w-[45rem] overflow-hidden rounded-xl bg-slate-50 shadow-xl shadow-blue-900/20 sm:w-auto lg:mt-0 lg:w-[67.8125rem]">
                      <img
                        src={features[activeFeatureIndex].image}
                        alt={features[activeFeatureIndex].alt}
                        className="object-fill"
                      />
                    </div>
                </div>
              </>
          </div>
        </div>
      </section>
    )
} 

export default Features