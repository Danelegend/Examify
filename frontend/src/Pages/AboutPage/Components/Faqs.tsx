import Accordion from '../../../Components/Accordion'
import backgroundImage from '../../../images/background-faqs.jpg'

const faqs = [
    {
      question: 'What is Examify?',
      answer: [
        'Examify is your comprehensive HSC solution. We provide the widest range of HSC exams, trial papers, and practice exams to assist you with your studies.',
        'We also offer features like favoriting exams and detailed analytics to help you improve.'
      ]
    },
    {
      question: 'What does Examify offer?',
      answer: [
        'Examify offers the largest collection of HSC and trial papers to aid in your HSC studies.',
        'Our platform includes features for exam management, such as favoriting exams for later review.',
        'Additionally, we provide detailed analytics and personalized recommendations to help you improve your study habits and exam results.'
      ]
    },
    {
      question: 'What makes you better than other platforms?',
      answer: [ 
        'While other platforms may offer great services, they often have clunky interfaces. Examify focuses on providing a user-friendly experience to make your study sessions efficient. ',
        'We offer unique features such as study analytics, personalized recommendations, and an upcoming tutoring platform that sets us apart.'
      ]
    },
    {
      question: 'How can I help out?',
      answer: [
        'At Examify, community involvement is key. Your feedback and suggestions are invaluable in helping us improve.',
        'You can also contribute by uploading HSC exams, trial papers, and practice exams, expanding our database and assisting other students.'
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
              alt="background"
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