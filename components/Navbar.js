'use client';
import { useEffect, useState } from 'react';
import { useAuth } from '@/context/AuthContext';

export default function Navbar({ onAccount, settings }) {
  const { user } = useAuth();
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const closeMenu = () => setMenuOpen(false);

  return (
    <>
      <div className="announcement-bar">Independent streetwear · Made in Kathmandu</div>
      <nav className={`site-nav ${scrolled ? 'scrolled' : ''}`}>
        <a href="#" className={`site-logo ${settings?.logoUrl ? 'has-image' : ''}`} aria-label="Kulture home">
          {settings?.logoUrl ? <img src={settings.logoUrl} alt="KULTURE" /> : <>K<span>/</span>KULTURE</>}
        </a>
        <ul className="nav-links">
          <li><a href="#drop">Shop</a></li>
          <li><a href="#lookbook">Lookbook</a></li>
          <li><a href="#story">Our story</a></li>
        </ul>
        <div className="nav-icons">
          <button className={`nav-account-btn ${user ? 'logged-in' : ''}`} onClick={onAccount}>
            <i className="ri-user-line" aria-hidden="true" />
            <span>{user ? 'My orders' : 'Account'}</span>
          </button>
          <button
            className="mobile-menu-toggle"
            type="button"
            aria-label={menuOpen ? 'Close navigation menu' : 'Open navigation menu'}
            aria-expanded={menuOpen}
            onClick={() => setMenuOpen((open) => !open)}
          >
            <i className={menuOpen ? 'ri-close-line' : 'ri-menu-3-line'} aria-hidden="true" />
          </button>
        </div>
      </nav>
      {menuOpen && (
        <div className="mobile-nav">
          <a href="#drop" onClick={closeMenu}>Shop the drop <i className="ri-arrow-right-up-line" /></a>
          <a href="#lookbook" onClick={closeMenu}>Lookbook <i className="ri-arrow-right-up-line" /></a>
          <a href="#story" onClick={closeMenu}>Our story <i className="ri-arrow-right-up-line" /></a>
          <span>Kathmandu, Nepal · Est. 2021</span>
        </div>
      )}
    </>
  );
}
