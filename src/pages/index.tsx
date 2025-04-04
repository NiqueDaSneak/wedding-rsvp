import * as React from 'react';
import type { HeadFC, PageProps } from 'gatsby';
import AnImage from '../images/sunsetImgs/1.jpeg';
import './index.scss';
import CountdownTimer from '../components/CountdownTimer/CountdownTimer';
// Add Google Fonts import in Head component

const IndexPage: React.FC<PageProps> = () => {
  return (
    <main
      style={{
        display: 'grid',
        gap: '60px',
        fontFamily: 'Cormorant Garamond, serif',
        color: '#333',
        // margin: '0 auto',
        // padding: '0 20px',
      }}
    >
      <section
        style={{
          display: 'grid',
          height: '50vh',
          alignItems: 'center',
          justifyItems: 'center',
          backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.3), rgba(0, 0, 0, 0.3)), url(${AnImage})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          color: 'white',
          position: 'relative',
          borderRadius: '8px',
          overflow: 'hidden',
        }}
      >
        <h1
          style={{
            fontFamily: 'Playfair Display, serif',
            fontSize: 'clamp(2.5rem, 8vw, 4.5rem)',
            fontWeight: '300',
            letterSpacing: '0.15em',
            textTransform: 'uppercase',
            margin: '0',
            textShadow: '0 2px 10px rgba(0,0,0,0.3)',
            textAlign: 'center',
            position: 'relative',
          }}
        >
          <span style={{ display: 'block', fontWeight: 200 }}>Dominique</span>
          <span
            style={{
              display: 'inline-block',
              margin: '0 10px',
              fontSize: '0.6em',
              verticalAlign: 'middle',
              fontFamily: 'Cormorant Garamond, serif',
              fontStyle: 'italic',
            }}
          >
            &
          </span>
          <span style={{ display: 'block', fontWeight: 200 }}>Sabigaynn</span>
        </h1>
      </section>

      <section
        style={{
          display: 'grid',
          justifyItems: 'center',
          gap: '20px',
          textAlign: 'center',
        }}
      >
        <h2
          style={{
            fontFamily: 'Playfair Display, serif',
            fontStyle: 'italic',
            fontWeight: 400,
            fontSize: 'clamp(1.5rem, 5vw, 2.5rem)',
            margin: '0',
            position: 'relative',
            paddingBottom: '25px',
          }}
        >
          We joyfully invite you to the celebration of our marriage
          <div
            style={{
              content: '""',
              position: 'absolute',
              bottom: '0',
              left: '50%',
              transform: 'translateX(-50%)',
              width: '80px',
              height: '2px',
              background: '#D0D0D0',
            }}
          ></div>
        </h2>
        <p
          style={{
            fontSize: '1.8rem',
            letterSpacing: '0.12em',
            fontFamily: 'Montserrat, sans-serif',
            fontWeight: '500',
          }}
        >
          SEPTEMBER 9, 2025
        </p>
      </section>

      <section
        style={{
          display: 'grid',
          justifyItems: 'center',
          gap: '25px',
          margin: '0 auto',
        }}
      >
        <img
          style={{
            width: '40%',
            borderRadius: '50%',
            boxShadow: '0 5px 15px rgba(0,0,0,0.1)',
          }}
          src={AnImage}
        />

        <h3
          style={{
            fontFamily: 'Montserrat, sans-serif',
            textTransform: 'uppercase',
            letterSpacing: '0.2em',
            fontSize: '1rem',
            fontWeight: '600',
            margin: '10px 0',
          }}
        >
          Family and Friends
        </h3>

        <p
          style={{
            fontSize: 'clamp(1.1rem, 3vw, 1.4rem)',
            lineHeight: '1.8',
            textAlign: 'center',
            fontWeight: '300',
          }}
        >
          We are thrilled to invite you to our wedding celebration, where love
          and laughter await. As we exchange our vows and embark on this
          beautiful journey together, your presence would mean the world to us
          as we celebrate this special day.
        </p>
      </section>

      {/* Additional sections with similar typographic treatment */}

      <section
        style={{
          display: 'grid',
          justifyItems: 'center',
          gap: '20px',
          background: '#f8f8f8',
          padding: '40px 20px',
          borderRadius: '8px',
        }}
      >
        <h2
          style={{
            fontFamily: 'Playfair Display, serif',
            fontSize: '2rem',
            fontWeight: '400',
            margin: '0',
            position: 'relative',
          }}
        >
          We are counting down the days until our special day!
        </h2>

        <div
          style={{
            fontFamily: 'Montserrat, sans-serif',
            fontSize: '1.6rem',
            fontWeight: '500',
            color: '#585858',
          }}
        >
          <CountdownTimer date="9/9/2025" />
        </div>
      </section>
      <section
        style={{
          display: 'grid',
          justifyItems: 'center',
          gap: '28px',
          padding: '40px 20px',
          background: '#fff',
          borderRadius: '8px',
          margin: '0 auto',
        }}
      >
        <img
          style={{
            width: '40%',
            borderRadius: '50%',
            boxShadow: '0 5px 15px rgba(0,0,0,0.1)',
          }}
          src={AnImage}
        />

        <h3
          style={{
            fontFamily: 'Playfair Display, serif',
            fontSize: '1.8rem',
            fontWeight: '400',
            margin: '0',
            position: 'relative',
            paddingBottom: '15px',
            textAlign: 'center',
          }}
        >
          Dress Code
          <div
            style={{
              content: '""',
              position: 'absolute',
              bottom: '0',
              left: '50%',
              transform: 'translateX(-50%)',
              width: '40px',
              height: '1px',
              background: '#D0D0D0',
            }}
          ></div>
        </h3>

        <p
          style={{
            fontFamily: 'Cormorant Garamond, serif',
            fontSize: '1.3rem',
            textAlign: 'center',
            margin: '0',
            lineHeight: '1.6',
          }}
        >
          Come dressed as a furry
        </p>

        <p
          style={{
            fontFamily: 'Montserrat, sans-serif',
            fontSize: '0.95rem',
            textTransform: 'uppercase',
            letterSpacing: '0.1em',
            fontWeight: '500',
            textAlign: 'center',
            margin: '10px 0 0',
          }}
        >
          We kindly encourage our guests to wear these colors for our special
          day:
        </p>

        <aside
          style={{
            display: 'flex',
          }}
        >
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
              style={{
                backgroundColor: color,
                width: '20px',
                height: '30px',
              }}
            ></div>
          ))}
        </aside>
      </section>

      <section
        style={{
          display: 'grid',
          justifyItems: 'center',
          gap: '25px',
          padding: '50px 20px',
          background: '#f8f8f8',
          borderRadius: '8px',
          margin: '0 auto',
        }}
      >
        <h2
          style={{
            fontFamily: 'Playfair Display, serif',
            fontSize: '2.2rem',
            fontWeight: '400',
            margin: '0',
            position: 'relative',
            paddingBottom: '18px',
            textAlign: 'center',
          }}
        >
          RSVP
          <div
            style={{
              content: '""',
              position: 'absolute',
              bottom: '0',
              left: '50%',
              transform: 'translateX(-50%)',
              width: '60px',
              height: '2px',
              background: '#D0D0D0',
            }}
          ></div>
        </h2>

        <p
          style={{
            fontSize: 'clamp(1.1rem, 2vw, 1.3rem)',
            lineHeight: '1.8',
            textAlign: 'center',
            fontFamily: 'Cormorant Garamond, serif',
            fontStyle: 'italic',
            color: '#555',
          }}
        >
          Whilst we love little ones, we kindly request a child-free wedding. We
          hope that the advanced notice means you are still able to attend.
        </p>

        <button
          style={{
            background: 'transparent',
            border: '1px solid #333',
            padding: '12px 28px',
            fontSize: '0.95rem',
            fontFamily: 'Montserrat, sans-serif',
            letterSpacing: '0.15em',
            textTransform: 'uppercase',
            cursor: 'pointer',
            transition: 'all 0.3s ease',
            margin: '10px 0',
            position: 'relative',
            overflow: 'hidden',
          }}
        >
          Click Here To RSVP
        </button>

        <p
          style={{
            fontFamily: 'Montserrat, sans-serif',
            fontSize: '0.9rem',
            letterSpacing: '0.08em',
            color: '#777',
            margin: '0',
          }}
        >
          Kindly respond by June 4th, 2025
        </p>

        <img
          style={{
            width: '40%',
            borderRadius: '50%',
            boxShadow: '0 5px 15px rgba(0,0,0,0.1)',
            margin: '20px 0',
          }}
          src={AnImage}
        />

        <p
          style={{
            fontSize: '1.4rem',
            fontFamily: 'Playfair Display, serif',
            fontStyle: 'italic',
            margin: '0',
            textAlign: 'center',
          }}
        >
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
