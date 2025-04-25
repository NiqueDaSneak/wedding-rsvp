import React, { useState } from 'react';
import './FAQAccordion.scss';

interface FAQItem {
  question: string;
  answer: React.ReactNode;
}

interface FAQAccordionProps {
  title: string;
  items: FAQItem[];
  icon?: React.ReactNode;
}

const FAQAccordion: React.FC<FAQAccordionProps> = ({ title, items, icon }) => {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const toggleAccordion = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <div className="faq-accordion">
      <div className="faq-category">
        {icon && <div className="category-icon">{icon}</div>}
        <h3 className="category-title">{title}</h3>
      </div>

      <div className="faq-items">
        {items.map((item, index) => (
          <div
            key={index}
            className={`faq-item ${openIndex === index ? 'open' : ''}`}
          >
            <button
              className="faq-question"
              onClick={() => toggleAccordion(index)}
              aria-expanded={openIndex === index}
            >
              {item.question}
              <span className="faq-icon">
                {openIndex === index ? '−' : '+'}
              </span>
            </button>

            {openIndex === index && (
              <div className="faq-answer">{item.answer}</div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default FAQAccordion;
