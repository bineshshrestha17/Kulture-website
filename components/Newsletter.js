import Reveal from './Reveal';

export default function Newsletter() {
  return (
    <section id="newsletter" className="newsletter-section">
      <Reveal className="newsletter">
        <div className="newsletter-copy">
          <p className="eyebrow"><span /> Stay in the loop</p>
          <h2>First to know.<br /><em>Never out of style.</em></h2>
          <p className="newsletter-note">Drop news, new stories, and the occasional good thing. No noise.</p>
        </div>
        <form className="form-group" onSubmit={(e) => e.preventDefault()}>
          <label className="visually-hidden" htmlFor="newsletter-email">Email address</label>
          <input id="newsletter-email" type="email" placeholder="Your email address" required />
          <button type="submit" aria-label="Submit email address"><i className="ri-arrow-right-line" aria-hidden="true" /></button>
        </form>
      </Reveal>
    </section>
  );
}
