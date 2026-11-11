'use client';
export default function Hero({ settings }) {
  const mediaType = settings.heroMediaType === 'image' && settings.heroImage
    ? 'image'
    : settings.heroMediaType === 'video' || settings.heroVideo || !settings.heroImage
      ? 'video'
      : 'image';
  const video = mediaType === 'video' ? settings.heroVideo || '/hero-video.mp4' : '';
  const image = mediaType === 'image' ? settings.heroImage : '';
  const button1 = settings.heroBtn1 ?? 'Shop the latest drop';
  const button2 = settings.heroBtn2 ?? 'Discover Kulture';

  return (
    <header className="campaign-hero">
      <div className="campaign-copy">
        <p className="eyebrow"><span /> Kathmandu, Nepal <span className="eyebrow-divider">/</span> Est. 2021</p>
        <h1>{settings.heroHeading || <>Wear your<br /><em>own story.</em></>}</h1>
        <p className="campaign-tagline">{settings.heroTagline || 'Streetwear for the ones who make their own rules.'}</p>
        <div className="campaign-actions">
          {button1 && <a href="#drop" className="campaign-button">{button1}<i className="ri-arrow-right-up-line" aria-hidden="true" /></a>}
          {button2 && <a href="#story" className="campaign-link">{button2}<i className="ri-arrow-down-line" aria-hidden="true" /></a>}
        </div>
        <div className="campaign-footnote"><span>001 — THE KULTURE UNIFORM</span><span>Designed for real life.</span></div>
      </div>
      <div className="campaign-visual">
        {video ? (
          <video key={video} className="campaign-media" src={video} autoPlay muted loop playsInline />
        ) : (
          <img
            key={image || 'default-hero'}
            className="campaign-media"
            src={image || 'https://images.unsplash.com/photo-1529139574466-a303027c1d8b?auto=format&fit=crop&w=1600&q=88'}
            alt="KULTURE streetwear editorial"
          />
        )}
        <div className="campaign-image-note"><span>01</span><span>STREET / CULTURE / SELF</span></div>
        <a href="#drop" className="campaign-scroll" aria-label="Scroll to latest drop">
          <span>Scroll to explore</span><i className="ri-arrow-down-line" aria-hidden="true" />
        </a>
      </div>
    </header>
  );
}
