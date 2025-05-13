import * as React from 'react';
import type { HeadFC, PageProps } from 'gatsby';
import AnImage from '../images/1.jpeg';
import Hero from '../images/2.jpg';
import ColorScheme from '../images/3.jpg';
import Last from '../images/4.jpg';
import './index.scss';
import CountdownTimer from '../components/CountdownTimer/CountdownTimer';
import SiteHeader from '../components/SiteHeader/SiteHeader';
import WebGPUHashtag from '../components/WebGPUHashtag/WebGPUHashtag';
import ColorPaletteGlissando from '../components/ColorPaletteGlissando/ColorPaletteGlissando';
import RainingHearts from '../components/RainingHearts/RainingHearts';
import RSVPForm from '../components/RSVPForm/RSVPForm';
import FAQSection from '../components/FAQSection/FAQSection';
import Song from '../images/song.mp3';
import { AnimatedImage, RandomRevealImage } from '../components/ImageEffects';
import StickyFooterHoneyfund from '../components/FloatingHoneyfund/StickyFooterHoneyfund';
import Button from '../components/Button';

const IndexPage: React.FC<PageProps> = () => {
  const [isRSVPFormOpen, setIsRSVPFormOpen] = React.useState(false);

  const openRSVPForm = () => {
    setIsRSVPFormOpen(true);
    document.body.style.overflow = 'hidden';
  };

  const closeRSVPForm = () => {
    setIsRSVPFormOpen(false);
    document.body.style.overflow = 'visible';
  };

  return (
    <main>
      <RainingHearts />

      <section
        className="hero-section"
        style={{ backgroundImage: `url(${Hero})` }}
      >
        <h1>
          <span>Dominique</span>
          <span className="ampersand">&</span>
          <span>Sabigaynn</span>
        </h1>
      </section>

      <section className="hashtag-section">
        <WebGPUHashtag hashtag="#itsclemmertime" />
      </section>

      <section className="invitation-section">
        <div className="wedding-audio-container">
          <audio src={Song} controls className="wedding-audio-player" />
          <p className="audio-caption">
            Listen to the song that captures our love story
          </p>
        </div>
        <h2>We joyfully invite you to the celebration of our marriage</h2>
        <p className="date">SEPTEMBER 9, 2025</p>
        <p className="animated-date">9/9/9</p>
      </section>

      <section className="about-section">
        <div className="image-container">
          <img src={AnImage} alt="Family and Friends" />
        </div>
        <h3>Family and Friends</h3>
        <hr />
        <p>
          We are thrilled to invite you to our wedding celebration, where love
          and laughter await. Your presence would mean the world to us as we
          celebrate this special day.
        </p>
      </section>

      <section className="countdown-section">
        <h2>We are counting down the days until our special day!</h2>
        <div className="timer">
          <CountdownTimer date="9/9/2025" />
        </div>
      </section>

      <section className="dress-code-section">
        <RandomRevealImage
          src={ColorScheme}
          alt="Outdoor Setting"
          className="grayscale-img"
          distance={120}
        />
        <h3>Dress Code</h3>
        <p>
          Please note that the event will be held outdoors on grass. We
          recommend wearing comfortable shoes suitable for the terrain.
        </p>
      </section>

      <section className="weekend-schedule-section">
        <h2>Weekend Schedule</h2>
        <p>
          <strong>Saturday - 9/6/25:</strong> #itsClemmerTime 90s themed party
        </p>
        <ul>
          <li>Costume Contest with $100 prize</li>
          <li>Bring a bottle to be entered to win another $100 prize</li>
        </ul>
        <p>
          <strong>Sunday - 9/7/25:</strong> Brunch
        </p>
        <p>
          More detailed information will be provided closer to the wedding date.
        </p>
      </section>

      <FAQSection />

      <section className="rsvp-section">
        <h2>RSVP</h2>
        <p className="notice">
          Whilst we love little ones, we kindly request a child-free wedding. We
          hope that the advanced notice means you are still able to attend.
        </p>
        <Button
          onClick={openRSVPForm}
          // style={{ color: '#0056b3', backgroundColor: '#ffffff' }}
        >
          Click Here To RSVP
        </Button>
        <p className="deadline">Kindly respond by June 4th, 2025</p>
        <RandomRevealImage src={Last} alt="RSVP" distance={180} />
        <p className="closing">
          We can't wait to share this wonderful day with you!
        </p>
      </section>

      <section className="honeyfund-section">
        <div className="honeyfund-container">
          <h2 className="honeyfund-title">Contribute to Our Journey</h2>
          <p className="honeyfund-description">
            We are so grateful for your love and support. If you'd like to help
            us start our new chapter, please visit our Honeyfund page.
          </p>
          <div className="honeyfund-button-container">
            <Button
              href="https://www.honeyfund.com/site/ItsClemmerTime"
              target="_blank"
              className="honeyfund-button"
            >
              Visit Honeyfund
            </Button>
          </div>
        </div>
      </section>

      <RSVPForm isOpen={isRSVPFormOpen} onClose={closeRSVPForm} />
      <StickyFooterHoneyfund />
    </main>
  );
};

export default IndexPage;

export const Head: HeadFC = () => (
  <>
    <title>D&S Wedding Invitation</title>
    <link rel="icon" href="/images/favicon.ico" type="image/x-icon" />
    <link rel="preconnect" href="https://fonts.googleapis.com" />
    <link
      rel="preconnect"
      href="https://fonts.gstatic.com"
      crossOrigin="anonymous"
    />
    <link
      href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,500;0,600;1,400&family=Montserrat:wght@300;400;500;600&family=Playfair+Display:ital,wght@0,400;0,500;0,600;1,400&display=swap"
      rel="stylesheet"
    />
  </>
);
