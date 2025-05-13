import React, { useState } from 'react';
import './FAQSection.scss';
import FAQAccordion from '../FAQAccordion/FAQAccordion';
import Button from '../Button';
import {
  FaPlane,
  FaBed,
  FaCar,
  FaCalendarAlt,
  FaChevronDown,
  FaChevronUp,
} from 'react-icons/fa';

interface FAQSectionProps {
  // Additional props if needed
}

const FAQSection: React.FC<FAQSectionProps> = () => {
  const [isExpanded, setIsExpanded] = useState(false);

  const toggleFAQs = () => {
    setIsExpanded(!isExpanded);
  };

  // Travel FAQs
  const travelFAQs = [
    {
      question: 'Where should I fly to?',
      answer: (
        <div>
          <p>
            You have several airport options within driving distance to our
            venue:
          </p>
          <ul>
            <li>
              <strong>Tampa Airport (TPA)</strong> - 35 mins from venue
            </li>
            <li>
              <strong>Sarasota Airport (SRQ)</strong> - 47 mins from venue -
              Allegiant Airlines
            </li>
            <li>
              <strong>Clearwater / St Pete Airport (PIE)</strong> - 45 mins from
              venue - Allegiant Airlines
            </li>
          </ul>
        </div>
      ),
    },
  ];

  // Accommodation FAQs
  const accommodationFAQs = [
    {
      question: 'Where should I stay?',
      answer: (
        <div>
          <p>
            <strong>Near the Wedding Venue:</strong>
          </p>
          <p>
            Fairfield Inn & Suites Riverview (5 mins from venue)
            <br />
            10743 Big Bend Road, Riverview, FL 33579
            <br />
            Phone: 813.644.4050
          </p>
          <p>
            <a
              href="https://www.marriott.com/event-reservations/reservation-link.mi?id=1744811946172&key=GRP&guestreslink2=true&app=resvlink"
              target="_blank"
              rel="noopener noreferrer"
            >
              Book with our group rate
            </a>
          </p>

          <p>
            <strong>In the City:</strong>
          </p>
          <p>
            Hotel Haya (27 mins from venue)
            <br />
            1412 E. 7th Avenue, Tampa, FL 33605
            <br />
            Phone: (813) 568-1200
          </p>
          <p>
            <a
              href="https://booking.hotelhaya.com/ibe/details.aspx?propertyid=16401&nights=1&checkin=9/5/2025&group=5229263&lang=en-us"
              target="_blank"
              rel="noopener noreferrer"
            >
              Book with our group rate
            </a>
          </p>

          <p>
            <strong>Near the Beach:</strong>
          </p>
          <p>
            We recommend looking at accommodations in St. Petersburg Beach or
            Clearwater Beach areas for those wanting to enjoy the beautiful
            Florida coast before or after our wedding.
          </p>
        </div>
      ),
    },
  ];

  // Transportation FAQs
  const transportationFAQs = [
    {
      question: 'What are the parking arrangements?',
      answer: (
        <div>
          <p>
            We have limited parking at Clemmer Farms, so we encourage using
            rideshare services like Uber or Lyft.
          </p>
          <p>
            For those who prefer not to drive, we will set up a shuttle service
            from a designated location near the venue:
          </p>
          <ul>
            <li>
              Shuttle pickup will run from 3:30-4:30 PM at 10-minute intervals
            </li>
            <li>
              Location details will be provided closer to the wedding date
            </li>
          </ul>
        </div>
      ),
    },
  ];

  // Schedule FAQs
  const scheduleFAQs = [
    {
      question: "What's the weekend itinerary?",
      answer: (
        <div>
          <p>
            <strong>Saturday:</strong> #itsClemmerTime 90s themed party
          </p>
          <ul>
            <li>Costume Contest with $100 prize</li>
            <li>Bring a bottle to be entered to win another $100 prize</li>
          </ul>
          <p>
            <strong>Sunday:</strong> Brunch
          </p>
          <p>
            More detailed information will be provided closer to the wedding
            date.
          </p>
        </div>
      ),
    },
  ];

  return (
    <div className="faq-section">
      <h2 className="section-title">Questions & Answers</h2>
      <div className="section-description">
        <p>
          We're here to help make your experience as smooth as possible. Find
          answers to common questions below.
        </p>
      </div>

      <Button
        className={`faq-toggle-button ${isExpanded ? 'expanded' : ''}`}
        onClick={toggleFAQs}
        aria-expanded={isExpanded}
        aria-controls="faq-content"
      >
        {isExpanded ? 'Hide FAQs' : 'View FAQs'}
        <span className="toggle-icon">
          {isExpanded ? <FaChevronUp /> : <FaChevronDown />}
        </span>
      </Button>

      <div
        id="faq-content"
        className={`faq-grid ${isExpanded ? 'expanded' : ''}`}
        aria-hidden={!isExpanded}
      >
        <div className="faq-grid-item">
          <FAQAccordion title="Travel" items={travelFAQs} icon={<FaPlane />} />
        </div>

        <div className="faq-grid-item">
          <FAQAccordion
            title="Accommodation"
            items={accommodationFAQs}
            icon={<FaBed />}
          />
        </div>

        <div className="faq-grid-item">
          <FAQAccordion
            title="Transportation"
            items={transportationFAQs}
            icon={<FaCar />}
          />
        </div>

        <div className="faq-grid-item">
          <FAQAccordion
            title="Weekend Schedule"
            items={scheduleFAQs}
            icon={<FaCalendarAlt />}
          />
        </div>
      </div>
    </div>
  );
};

export default FAQSection;
