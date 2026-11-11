'use client';
export default function Footer({ settings }) {
  const goShop = () => document.getElementById('drop')?.scrollIntoView({ behavior: 'smooth' });
  return (
    <footer>
      <div className="footer-col">
        <a href="#" className={`footer-logo ${settings?.logoUrl ? 'has-image' : ''}`}>
          {settings?.logoUrl ? <img src={settings.logoUrl} alt="KULTURE" /> : 'KULTURE'}
        </a>
        <p style={{ color: 'var(--muted)', marginTop: '1rem', fontSize: '.9rem' }}>Kathmandu, Nepal<br />Est. 2021</p>
      </div>
      <div className="footer-col">
        <h4>Shop</h4>
        <ul>{['All Products', 'Outerwear', 'Tees', 'Bottoms', 'Accessories'].map((t) => <li key={t} onClick={goShop}>{t}</li>)}</ul>
      </div>
      <div className="footer-col">
        <h4>Support</h4>
        <ul>
          <li onClick={() => window.open('https://wa.me/9779808637923?text=Hi, I need help with my KULTURE order.', '_blank')}>Contact Us</li>
          <li onClick={() => alert('We deliver across Nepal within 3-5 business days. Free delivery on orders above NPR 3000.')}>Shipping &amp; Delivery</li>
          <li onClick={() => alert('Returns accepted within 7 days of delivery. Item must be unused and in original packaging. Contact us on WhatsApp to initiate a return.')}>Returns &amp; Exchanges</li>
          <li onClick={() => alert('For any questions, reach us on Instagram @Kulture_np or WhatsApp.')}>FAQ</li>
        </ul>
      </div>
      <div className="footer-col">
        <h4>Socials</h4>
        <ul>
          <li><a target="_blank" rel="noreferrer" href="https://instagram.com/Kulture_np">Instagram</a></li>
          <li><a target="_blank" rel="noreferrer" href="https://tiktok.com/@kulture_np">TikTok</a></li>
          <li><a target="_blank" rel="noreferrer" href="https://twitter.com/Kulture_np">Twitter / X</a></li>
          <li><a target="_blank" rel="noreferrer" href="https://pinterest.com/Kulture_np">Pinterest</a></li>
        </ul>
      </div>
      <div className="footer-bottom">© 2026 KULTURE. All rights reserved.</div>
    </footer>
  );
}
