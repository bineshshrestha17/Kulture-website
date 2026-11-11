'use client';
import Reveal from './Reveal';
import { useAuth } from '@/context/AuthContext';

export default function ProductGrid({ products, loading, onOpen, onOrder, onEdit }) {
  const { isAdmin } = useAuth();
  return (
    <section id="drop" className="shop-section">
      <Reveal className="editorial-header section-header">
        <div>
          <p className="eyebrow"><span /> The current collection</p>
          <h2>Fresh off<br className="mobile-break" /> the <em>streets.</em></h2>
        </div>
        <div className="shop-header-note">
          <span>{loading ? '—' : String(products.length).padStart(2, '0')} pieces</span>
          <p>Limited by design.<br />Made to move with you.</p>
        </div>
      </Reveal>
      <div className="editorial-product-grid grid-drop">
        {loading ? <div className="grid-loading">LOADING DROP…</div> : products.map((p, i) => (
          <Reveal key={p._docId || p.id} className="product-card" delay={i * 0.08}>
            <article>
              <div className="product-image-area">
                <button className="product-image-button" type="button" onClick={() => onOpen(p)} aria-label={`View ${p.name}`}>
                  <span className="product-index">{String(i + 1).padStart(2, '0')}</span>
                  <div className="product-img-wrap">
                    <img src={p.img1} className="img-main" alt={p.name} />
                    <img src={p.img2 || p.img1} className="img-hover" alt="" aria-hidden="true" />
                  </div>
                  <span className="product-quick-view">Quick view <i className="ri-arrow-right-up-line" aria-hidden="true" /></span>
                </button>
                {isAdmin && <button className="card-edit-btn" onClick={() => onEdit(p)}>Edit</button>}
              </div>
              <div className="product-info">
                <button className="product-title" type="button" onClick={() => onOpen(p)}>{p.name}</button>
                <span className="product-price">{p.price}</span>
              </div>
              <div className="product-card-meta">
                <span>{p.status === 'live' ? 'Available now' : p.status === 'sold' ? 'Sold out' : 'Coming soon'}</span>
                <button className="product-order-link" type="button" onClick={() => onOrder(p)}>
                  Place order <i className="ri-arrow-right-line" aria-hidden="true" />
                </button>
              </div>
            </article>
          </Reveal>
        ))}
      </div>
    </section>
  );
}
