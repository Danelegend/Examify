import Accordion from '../../../Components/Accordion'
import backgroundImage from '../../../images/background-faqs.jpg'

const faqs = [
    {
      question: 'What is Examify?',
      answer: [
        'Examify is your all-in-one HSC solution. We provide the widest range of HSC exams to assist you with your studies.',
        'We offer many other features to help you strive for success. This includes favouriting exams you may wish to review.'
      ]
    },
    {
      question: 'What makes you better than other platforms?',
      answer: [ 
        'Other platforms offer excellent services, however, they often have clunky interfaces. We strive to offer a user-friendly experience to make your study sessions as efficient as possible.',
        'We also offer a variety of other features not seen else where. These include analytics on your study, recommendations that we think can help you improve, and our soon to be released tutoring platform.'
      ]
    },
    {
      question: 'How can I help out?',
      answer: [
        'At Examify, we\'re all about community. We believe that the best way to improve is to work together. As such, your feedback and suggestions are invaluable.',
        'Additionally, we need your help to expand our exam database. Any resources you upload are greatly appreciated and assist both us and other students, both current and future.'
      ]
    },
  ]

const Faqs = () => {
    return (
        <section
          id="faq"
          aria-labelledby="faq-title"
          className="relative overflow-hidden bg-slate-50 py-20 sm:py-32"
        >
          <h2 id="faq-title" className="sr-only">
            Frequently asked questions
          </h2>
          <div className="absolute top-0 left-1/2 -translate-x-[30%] -translate-y-[25%]">
            <img
              src={backgroundImage}
              alt=""
              width={1558}
              height={946}
            />
          </div>
          <div className="relative">
            <div className="mx-auto max-w-2xl lg:mx-0">
              <p className="font-display text-3xl tracking-tight text-slate-900 sm:text-4xl text-center">
                Frequently asked questions
              </p>
            </div>
            <Accordion className="mt-12 px-56"
              data={
                faqs.map(({ question, answer }) => ({
                  title: question,
                  content: answer,
                }))
            } />
          </div>
        </section>
      )
}

export default Faqs