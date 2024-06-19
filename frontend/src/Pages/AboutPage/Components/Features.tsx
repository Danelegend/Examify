import { useEffect, useState } from "react"

type Feature = {
    title: string,
    description: string
}

/*
const Features = () => {
    const features: Feature[] = [
        {
            title: "Exam Finding",
            description: "We know how hard it can be looking for practice exams so we provide the largest collection of HSC and Trial exams. Our filtering features help you find what you want."
        },
        {
            title: "Analytics",
            description: "Wanting to know how you're progressing. We have you covered with analytics letting you know how your progression is coming along"
        }
    ]

    return (
        <section 
                id="features"
                aria-labelledby="features-title"
                className="relative overflow-hidden bg-blue-600 pt-20 pb-28 sm:py-32">
            <div className="relative">
            <div className="mx-auto text-center">
                <div className="font-display text-3xl tracking-tight text-white sm:text-4xl md:text-5xl">
                    Everything you need to master your HSC
                </div>
                <div className="mt-6 text-lg tracking-tight text-blue-100">
                    Well everything except that half decent sleep schedule 
                </div>
            </div>
            <div className="grid grid-cols-1 items-center gap-y-2 pt-10 sm:gap-y-6 md:mt-20 lg:pt-0">
                {
                    features.map((feature, index) => (
                        <div className="group relative rounded-full py-1 px-4 lg:rounded-r-none lg:rounded-l-xl lg:p-6 hover:bg-white/10 lg:hover:bg-white/5" key={index}>
                            <div className="font-display text-lg [&:not(:focus-visible)]:focus:outline-none text-blue-100 hover:text-white lg:text-white">
                            <div>
                                {feature.title}
                            </div>
                            <div>
                                {feature.description}
                            </div>
                            </div>
                        </div>
                    ))
                }
            </div>
            </div>
        </section>
    )
}

const Features = () => {
    const features: Feature[] = [
        {
            title: "Exam Finding",
            description: "We know how hard it can be looking for practice exams so we provide the largest collection of HSC and Trial exams. Our filtering features help you find what you want."
        },
        {
            title: "Analytics",
            description: "Wanting to know how you're progressing. We have you covered with analytics letting you know how your progression is coming along"
        }
    ]

    let [tabOrientation, setTabOrientation] = useState('horizontal')

  useEffect(() => {
    let lgMediaQuery = window.matchMedia('(min-width: 1024px)')

    function onMediaQueryChange({ matches }) {
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
      <div className="relative">
        <div className="max-w-2xl md:mx-auto md:text-center xl:max-w-none">
          <h2
            id="features-title"
            className="font-display text-3xl tracking-tight text-white sm:text-4xl md:text-5xl"
          >
            Everything you need to run your books.
          </h2>
          <p className="mt-6 text-lg tracking-tight text-blue-100">
            Well everything you need if you aren’t that picky about minor
            details like tax compliance.
          </p>
        </div>
        <div
          className="mt-16 grid grid-cols-1 items-center gap-y-2 pt-10 sm:gap-y-6 md:mt-20 lg:grid-cols-12 lg:pt-0">
            <>
              <div className="-mx-4 flex overflow-x-auto pb-4 sm:mx-0 sm:overflow-visible sm:pb-0 lg:col-span-5">
                <div className="relative z-10 flex space-x-4 whitespace-nowrap px-4 sm:mx-auto sm:px-0 lg:mx-0 lg:block lg:space-y-1 lg:space-x-0 lg:whitespace-normal">
                  {features.map((feature, featureIndex) => (
                    <div
                      key={featureIndex}
                      className={
                        'group relative rounded-full py-1 px-4 lg:rounded-r-none lg:rounded-l-xl lg:p-6 hover:bg-white/10 lg:hover:bg-white/5'
                      }
                    >
                      <h3>
                        <div
                          className={
                            'font-display text-lg [&:not(:focus-visible)]:focus:outline-none text-blue-100 hover:text-white lg:text-white'
                        }
                        >
                          <span className="absolute inset-0 rounded-full lg:rounded-r-none lg:rounded-l-xl" />
                          {feature.title}
                        </div>
                      </h3>
                      <p
                        className={'mt-2 hidden text-sm lg:block text-white'
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
                    <div className="relative mt-10 aspect-[1085/730] w-[45rem] overflow-hidden rounded-xl bg-slate-50 shadow-xl shadow-blue-900/20 sm:w-auto lg:mt-0 lg:w-[67.8125rem]">
                      <img
                        src={"data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAM0AAACUCAMAAAAH411kAAAA4VBMVEUTExMAAMDAwMAAwMDAAMDAwAAAwADAAAD///8AIUwyAGoJCQkdHR0AAMa+vsW7u1DEvwAAwMcAv7q1KbXAAMcBvACcAVEOFAAAAACIvXO9AXMTAAAAADuamqb19PdvYo8kAGQAIkOGhsB0dMAAGIBsbGzFxcATCxMAx8B1h8CFdMALhguGhguGCwsvBWMObGwoCk91AI9RUVEAFAAQEFG1BLUEtbVvDXLouugKHDqJwnEAxrgAyQCDhVF8hW9uh7V9drWFQ3CBMVEACwAJG1AAAC9xcnvPu8+TSKQQPz80NDTYr8BoAAABhklEQVR4nO3W6U7CQBhG4WFxwQFXlGpVXAFX1CK4b3W//wsSlcY0mXklMfoDz+nvr8nT6SSfyYrGJ4b8Tc5P5fxNzw6LZvL+ygsjorlSRmTQoEGDBg0aNGjQoEGDBg0aNGjQoEGDBg0aNGjQoEGDBg0aNGjQoEGDBg0aNGjQoEGDBg0aNGjQoEGDBg0aNGjQoEGDBg0aNGjQoEGDBg0aNGjQoEEzyJqaKCs1Z7mGv3OFufg1zZrqcld0tSW63lHdbItu90R36yqjqJmWrXuLO+ID549j/2Q9bItTbTRD4y04qqmrITWlVsX/4qhTVprIP2nCtrhxOaWxA6ZRGDRo0KBBg+ZvNCVVTxM405tNVHH1U013s1HLgNlQ3Z++9/DoHH06SfV8mOrAWfypaapeAmO7j7HWwXndVJlVVeGjxaXRPqqupBpztZ8cjswmfSGKSZ7/pJcpfF9fmuWqG+DUyKzSFPUsGjRo0KBBgwYNGjRo0KBBgwYNGjRo0KBBgwYNGjRo/qHmDTxAyCTXVsjxAAAAAElFTkSuQmCC"}
                        width={1024}
                        alt=""
                      />
                    </div>
                  </div>
                ))}
              </div>
            </>
        </div>
      </div>
    </section>
  )
} */

const Features = () => {
    return (
        <div>
            
        </div>
    )
}

export default Features