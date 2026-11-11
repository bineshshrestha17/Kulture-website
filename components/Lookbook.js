import Reveal from './Reveal';
import { DEFAULT_LOOKBOOK } from '@/lib/utils';

export default function Lookbook({ settings }) {
  const imgs = [1, 2, 3, 4].map((n, i) => settings[`lbImg${n}`] || DEFAULT_LOOKBOOK[i]);
  return (
    <section id="lookbook" className="lookbook-section">
      <Reveal className="editorial-header lookbook-heading section-header">
        <div>
          <p className="eyebrow"><span /> In the frame</p>
          <h2>{settings.lbTitle || 'Seen on the streets.'}</h2>
        </div>
        <p className="lookbook-description">Real people. Real places.<br />A point of view all our own.</p>
      </Reveal>
      <Reveal className="lookbook-grid">
        {imgs.map((src, i) => (
          <figure key={i} className={`lb-item lb-${i + 1}`}>
            <img src={src} alt={`KULTURE streetwear editorial ${i + 1}`} />
            <figcaption>KTM · 00{i + 1}</figcaption>
          </figure>
        ))}
      </Reveal>
    </section>
  );
}
