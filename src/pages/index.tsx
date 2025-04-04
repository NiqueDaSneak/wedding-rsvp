import * as React from 'react';
import type { HeadFC, PageProps } from 'gatsby';
import AnImage from '../images/1.jpeg';
import './index.scss';
import CountdownTimer from '../components/CountdownTimer/CountdownTimer';

const IndexPage: React.FC<PageProps> = () => {
  return (
    <main>
      <section
        className="hero-section"
        style={{ backgroundImage: `url(${AnImage})` }}
      >
        <h1>
          <span>Dominique</span>
          <span className="ampersand">&</span>
          <span>Sabigaynn</span>
        </h1>
      </section>

      <section className="invitation-section">
        <h2>We joyfully invite you to the celebration of our marriage</h2>
        <p className="date">SEPTEMBER 9, 2025</p>
      </section>

      <section className="about-section">
        <img src={AnImage} alt="Couple" />
        <h3>Family and Friends</h3>
        <p>
          We are thrilled to invite you to our wedding celebration, where love
          and laughter await. As we exchange our vows and embark on this
          beautiful journey together, your presence would mean the world to us
          as we celebrate this special day.
        </p>
      </section>

      <section className="countdown-section">
        <h2>We are counting down the days until our special day!</h2>
        <div className="timer">
          <CountdownTimer date="9/9/2025" />
        </div>
      </section>

      <section className="dress-code-section">
        <img src={AnImage} alt="Dress code" />
        <h3>Dress Code</h3>
        <p>Come dressed as a furry</p>
        <p className="note">
          We kindly encourage our guests to wear these colors for our special
          day:
        </p>
        <aside className="color-palette">
          {[
            '#FFFFFF',
            '#F0F0F0',
            '#E0E0E0',
            '#D0D0D0',
            '#C8C8C8',
            '#B8B8B8',
            '#A0A0A0',
            '#888888',
            '#787878',
            '#707070',
            '#585858',
            '#404040',
            '#303030',
            '#202020',
          ].map((color) => (
            <div
              className="color-swatch"
              style={{ backgroundColor: color }}
              key={color}
            />
          ))}
        </aside>
      </section>

      <section className="rsvp-section">
        <h2>RSVP</h2>
        <p className="notice">
          Whilst we love little ones, we kindly request a child-free wedding. We
          hope that the advanced notice means you are still able to attend.
        </p>
        <button>Click Here To RSVP</button>
        <p className="deadline">Kindly respond by June 4th, 2025</p>
        <img src={AnImage} alt="RSVP" />
        <p className="closing">
          We can't wait to share this wonderful day with you!
        </p>
      </section>
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
