import Reveal from './Reveal';

export default function Story() {
  return (
    <section id="story" className="story-section">
      <Reveal className="story-inner">
        <div className="story-marker"><span>Our point of view</span><span>KTM / 2021—NOW</span></div>
        <h2>Not made to<br /><em>fit in.</em></h2>
        <div className="story-copy">
          <p>KULTURE is an independent streetwear label from Kathmandu, built around self-expression and the people who make this city move.</p>
          <a href="#lookbook" className="story-link">See KULTURE in the wild <i className="ri-arrow-right-up-line" aria-hidden="true" /></a>
        </div>
      </Reveal>
    </section>
  );
}
