'use client';
import { useEffect, useState } from 'react';

export default function ProductModal({ product, onClose, onOrder }) {
  const [size, setSize] = useState('M');
  const [origin, setOrigin] = useState('center center');
  const [zoom, setZoom] = useState(false);

  useEffect(() => {
    document.body.style.overflow = product ? 'hidden' : 'auto';
    return () => { document.body.style.overflow = 'auto'; };
  }, [product]);

  const onMove = (e) => {
    const r = e.currentTarget.getBoundingClientRect();
    setOrigin(`${((e.clientX - r.left) / r.width) * 100}% ${((e.clientY - r.top) / r.height) * 100}%`);
    setZoom(true);
  };

  return (
    <div className={`product-modal ${product ? 'active' : ''}`}>
      <button className="close-modal" onClick={onClose}><i className="ri-close-line" /></button>
      <div className="prod-gallery" onMouseMove={onMove} onMouseLeave={() => setZoom(false)}>
        <img src={product?.img1 || ''} alt="Product" style={{ transformOrigin: origin, transform: zoom ? 'scale(1.8)' : 'scale(1)' }} />
      </div>
      <div className="prod-details">
        <h2>{product?.name}</h2>
        <div className="price">{product?.price}</div>
        <p>{product?.desc}</p>
        <div className="size-selector">
          <h4>Select Size</h4>
          <div className="sizes">
            {['S', 'M', 'L', 'XL'].map((s) => (
              <button key={s} className={`size-btn ${size === s ? 'active' : ''}`} onClick={() => setSize(s)}>{s}</button>
            ))}
          </div>
        </div>
        <div className="prod-actions">
          <button className="btn btn-primary" onClick={() => onOrder(product, size)}>Place Order</button>
          <a href={product?.ig || 'https://instagram.com/Kulture_np'} target="_blank" rel="noreferrer" className="btn btn-secondary">DM Us</a>
        </div>
      </div>
    </div>
  );
}
