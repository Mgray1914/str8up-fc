import { useState } from 'react';
import { Plus, Minus } from 'lucide-react';

const faqs = [
  {
    question: 'What is Str8Up?',
    answer:
      'Str8Up is a peer-to-peer sports prediction platform built on Base blockchain. Users can create or join 1v1 prediction battles with simple win/lose outcomes, no complex odds or house edges. All wagers are secured through smart contracts with instant payouts.',
  },
  {
    question: 'How is Str8Up different from traditional sportsbooks?',
    answer: `Unlike traditional sportsbooks, Str8Up offers:

True peer-to-peer betting with no house edge

Simple $5 USD increment wagering

Instant blockchain-based settlements

Complete transparency through smart contracts

Token holder revenue sharing`,
  },
  {
    question: 'How do I start using Str8Up? ',
    answer:
      `Getting started is simple: 

Connect your crypto wallet 

Acquire STR8 tokens through Uniswap 

Browse available contests or create your own 

Set your wager and wait for an opponent 

Watch the game and collect your winnings `,
  },
  {
    question: 'What is the STR8 token? ',
    answer:
      'STR8 is an ERC20 token built on Base blockchain that serves as the platform currency for all wagering. It also provides holders with staking rewards, revenue sharing opportunities, and governance rights. ',
  },
];

export default function FAQSection() {
  const [openIndex, setOpenIndex] = useState(null);

  const toggleItem = (index) => {
    setOpenIndex((prev) => (prev === index ? null : index));
  };

  // Split FAQ array into two columns
  const mid = Math.ceil(faqs.length / 2);
  const leftColumn = faqs.slice(0, mid);
  const rightColumn = faqs.slice(mid);

const renderAnswer = (answer) => {
  const lines = answer.split("\n").filter(line => line.trim() !== '');
  if (lines.length > 1) {
    // First line is the heading, rest are list items
    const heading = lines[0];
    const listItems = lines.slice(1);
    return (
      <div>
        <p className="font-medium mb-2">{heading}</p>
        <ul className="list-disc pl-5">
          {listItems.map((item, idx) => (
            <li key={idx}>{item.trim()}</li>
          ))}
        </ul>
      </div>
    );
  }
  return answer;
};


  const renderFAQColumn = (column) =>
    column.map((faq, index) => (
      <div
        key={index}
        className="shadow-[0px_28.2px_37.6px_-16.92px_#95959540] rounded-md transition-all duration-300 self-start bg-[#101010] mb-4"
      >
        <div className="px-6 py-10">
          <div
            className="flex items-start cursor-pointer"
            onClick={() => toggleItem(faqs.indexOf(faq))}
          >
            <span className="mr-4 mt-1 text-white flex-shrink-0">
              {openIndex === faqs.indexOf(faq) ? (
                <Minus className="w-5 h-5" />
              ) : (
                <Plus className="w-5 h-5" />
              )}
            </span>
            <h3 className="text-white font-medium md:text-[20px] text-[18px]">
              {faq.question}
            </h3>
          </div>
          {openIndex === faqs.indexOf(faq) && (
            <div className="mt-4 text-[#F2F2F2] opacity-70 text-[16px] pl-9 leading-[25px]">
              {renderAnswer(faq.answer)}
            </div>
          )}
        </div>
      </div>
    ));

  return (
    <section className="bg-[#0D0D0D] text-white py-20 md:px-4 faqPage overflow-hidden" id="faqs">
      <div className="container mx-auto px-2">
        {/* Header */}
        <div className="text-center mb-16">
          <h3 className="sectionHeading mb-4">Frequently Asked Questions</h3>
          <p className="text-subheading text-[20px]">
            Everything you need to know about using Str8Up
          </p>
        </div>

        {/* FAQ Columns */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-start">
          <div>{renderFAQColumn(leftColumn)}</div>
          <div>{renderFAQColumn(rightColumn)}</div>
        </div>
      </div>
    </section>
  );
}
