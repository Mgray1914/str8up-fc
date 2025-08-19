import { useState } from 'react';
import { Plus, Minus } from 'lucide-react';

const faqs = [
  {
    question: 'How long until we deliver your first blog post?',
    answer: 'Really boy law county she unable her sister. Feet you off its like like six. Among sex are leave law built now. In built table in an rapid blush. Merits behind on afraid or warmly.',
  },
  {
    question: 'What\'s the turnaround time for the first post?',
    answer: 'We typically deliver your first blog post within 3-5 business days after receiving all necessary information and content requirements from you.',
  },
  {
    question: 'Can I request revisions?',
    answer: 'Yes, we offer revisions based on the package you choose. You can request changes until you\'re satisfied.',
  },
  {
    question: 'Is there a contract?',
    answer:
      'No long-term contracts. You can pause, upgrade, or cancel your subscription anytime.',
  },
  {
    question: 'Do you provide SEO optimization?',
    answer: 'Absolutely. All blog posts are written with SEO best practices including keyword placement and meta descriptions.',
  },
];

export default function FAQSection() {
  const [openIndex, setOpenIndex] = useState(null);

  const toggleItem = (index) => {
    setOpenIndex((prev) => (prev === index ? null : index));
  };

  return (
    <section className=" bg-[#0D0D0D] text-white py-20 md:px-4 faqPage">
      <div className="container mx-auto px-2">
        {/* Header */}
        <div className="text-center mb-16">
          <h3 className="sectionHeading mb-4">Frequently Ask Questions</h3>
          <p className="text-subheading text-[20px]">Everything you need to know about using Str8up</p>
        </div>

        {/* Fixed layout - each item is independent */}
       
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-start">
            <div className="">
            {faqs.map((faq, index) => {
                if(index < 3)  return(
              <div
                key={index}
                className=" shadow-[0px_28.2px_37.6px_-16.92px_#95959540]  rounded-md transition-all duration-300 self-start bg-[#101010]">
                <div className="md:px-6 md:py-10 px-2 py-5 mb-4">
                  <div
                    className="flex items-start cursor-pointer"
                    onClick={() => toggleItem(index)}
                  >
                    <span className="mr-4 mt-1 text-white flex-shrink-0">
                      {openIndex === index ? <Minus className="w-5 h-5" /> : <Plus className="w-5 h-5" />}
                    </span>
                    <h3 className="text-white font-medium md:text-[20px] text-[18px]">{faq.question}</h3>
                  </div>
                  {openIndex === index && (
                    <div className="mt-4 text-[#F2F2F2] opacity-70 text-[16px] pl-9 leading-[25px]">
                      {faq.answer}
                    </div>
                  )}
                </div>
              </div>
            )})}
            </div>
              <div className="">
                {faqs.map((faq, index) =>{ 
                if(index > 2)  return(
              <div
                key={index}
                className=" shadow-[0px_28.2px_37.6px_-16.92px_#95959540]  rounded-md transition-all duration-300 self-start bg-[#101010] mb-4">
                <div className="px-6 py-10">
                  <div
                    className="flex items-start cursor-pointer"
                    onClick={() => toggleItem(index)}
                  >
                    <span className="mr-4 mt-1 text-white flex-shrink-0">
                      {openIndex === index ? <Minus className="w-5 h-5" /> : <Plus className="w-5 h-5" />}
                    </span>
                    <h3 className="text-white font-medium text-[20px]">{faq.question}</h3>
                  </div>
                  {openIndex === index && (
                    <div className="mt-4 text-[#F2F2F2] opacity-70 text-[16px] pl-9 leading-[25px]">
                      {faq.answer}
                    </div>
                  )}
                </div>
              </div>
            )})}
              </div>
          </div>
        </div>
    </section>
  )
}