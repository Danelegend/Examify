import { useState } from "react"

type AccordionItem = {
    title: string
    content: string[]
}

type AccordionProps = {
    className?: string
    data: AccordionItem[]
}   

const AccordionItem = ({ title, content }: AccordionItem) => {
    const [isOpen, setIsOpen] = useState(false)

    const toggle = () => {
        setIsOpen(!isOpen)
    }

    return (
        <div>
            <h2>
                <div onClick={toggle} className="flex items-center cursor-pointer justify-between w-full p-5 font-medium rtl:text-right text-gray-500 border border-b-0 border-gray-200 rounded-t-xl focus:ring-4 focus:ring-gray-200 hover:bg-gray-100 gap-3" aria-expanded="true">
                    <span>{title}</span>
                    <svg data-accordion-icon className="w-3 h-3 rotate-180 shrink-0" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 10 6">
                        <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5 5 1 1 5"/>
                    </svg>
                  </div>
              </h2>
              <div id="accordion-collapse-body-1" className={isOpen ? "" : "hidden"} aria-labelledby="accordion-collapse-heading-1">
                  <div className="p-5 space-y-4 border border-b-0 border-gray-200">
                      {
                        content.map((item, index) => (
                            <p key={index} className="mb-2 text-gray-500">{item}</p>
                        ))
                      }
                  </div>
              </div>
        </div>
    )
}

const Accordion = ({ data, className }: AccordionProps) => {
    return (
        <div id="accordion-collapse" className={className}>
            {
                data.map((item, index) => (
                    <AccordionItem key={index} {...item} />
                ))
            }
        </div>
    )
}

export default Accordion