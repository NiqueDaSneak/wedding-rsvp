import * as React from 'react';
import type { HeadFC, PageProps } from 'gatsby';
import logo from '../images/pyramids.svg';
import IntroText from '../components/IntroText/IntroText';
import './index.scss';
import GridFade from '../components/GridFade/GridFade';
import TypeItOut from '../components/TypeItOut/TypeItOut';
import RSVPForm from '../components/RSVPForm/RSVPForm';
const phrases = ["You've been with us since the beginning:", 'Every sunset,'];
const IndexPage: React.FC<PageProps> = () => {
  return (
    <main style={{ padding: '10px' }}>
      <section
        style={{
          marginBottom: '40px',
          paddingTop: '40px',
          height: '100dvh',
          display: 'grid',
          gridTemplateRows: 'auto auto 50%',
          alignItems: 'center',
          justifyItems: 'center',
        }}
        // className="text-photos-container"
      >
        <div>
          <img
            style={{ fill: 'red', width: '350px' }}
            //  style={{ height: '90px', width: '90px' }}
            src={logo}
          />
        </div>
        <TypeItOut text="Dominique & Sabigaynn want to invite you..." />
        <GridFade singleRow directory="headerImgs" />
      </section>
      <section className="text-photos-container">
        <TypeItOut text="You've been with us since the beginning:" />
        <GridFade directory="theBeginning" />
      </section>
      <section className="text-photos-container">
        <TypeItOut text="Every sunset," />
        <GridFade directory="sunsetImgs" />
      </section>
      <section className="text-photos-container">
        <TypeItOut text="every ocean," />
        <GridFade directory="oceanImgs" />
      </section>
      <section className="text-photos-container">
        <TypeItOut text="every country." />
        <GridFade directory="countryImgs" />
      </section>
      <section className="text-photos-container">
        <TypeItOut text="Now we invite you to come with us on our first trip as Mr. & Mrs." />
        <GridFade directory="lastImgs" />
      </section>
      <section
        style={{
          textAlign: 'center',
          fontFamily: "'Playwrite TZ', cursive",
        }}
      >
        <p style={{ color: 'white', fontSize: '8pt' }}>
          *did you click the photos?
        </p>
        <p
          style={{
            fontSize: '17pt',
            color: 'white',
            width: '70%',
            marginTop: '50px',
            marginBottom: '50px',
            marginLeft: '15%',
          }}
        >
          After our wedding, we would like you, our friends and family, to join
          us on our <span style={{ color: 'forestgreen' }}>homie</span>moon!
        </p>
        <aside
          style={{
            display: 'grid',
            gridTemplateRows: '1fr 1fr',
            marginBottom: '50px',
          }}
        >
          <span style={{ color: 'white' }}>
            Please join us in Hurghada, Egypt:
          </span>
          <span style={{ color: 'white' }}>Sept 12th - 21st 2025</span>
        </aside>
        <p style={{ color: 'white', fontSize: '12pt' }}>
          More details after RSVP
        </p>
        <p style={{ color: 'white', fontSize: '12pt' }}>RSVP by 11/02/2024</p>
        <RSVPForm />
      </section>
    </main>
  );
};

export default IndexPage;

export const Head: HeadFC = () => (
  <>
    <title>D&S Homiemoon Invite</title>
    <link rel="icon" href="/images/favicon.ico" type="image/x-icon" />
  </>
);
