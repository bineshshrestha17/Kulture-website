'use client';
import { useEffect, useRef, useState } from 'react';
import { DEFAULT_LOOKBOOK } from '@/lib/utils';
import ImageField from './ImageField';
import HeroMediaField from './HeroMediaField';
import LogoUploadField from './LogoUploadField';

function useSaved() {
  const [saved, setSaved] = useState(false);
  return [saved, () => { setSaved(true); setTimeout(() => setSaved(false), 2500); }];
}

export function HeroSection({ settings, onSave }) {
  const [f, setF] = useState({});
  const formRef = useRef(f);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [saved, flash] = useSaved();
  formRef.current = f;
  useEffect(() => setF({
    heroHeading: settings.heroHeading || '', heroTagline: settings.heroTagline || 'YOUTH INFLUENCE.',
    heroBtn1: settings.heroBtn1 || '', heroBtn2: settings.heroBtn2 || '',
    heroImage: settings.heroImage || '', heroVideo: settings.heroVideo || '',
    heroMediaType: settings.heroMediaType === 'image' && settings.heroImage
      ? 'image'
      : settings.heroMediaType === 'video' || settings.heroVideo || !settings.heroImage
        ? 'video'
        : 'image',
  }), [settings]);
  const set = (k) => (e) => setF({ ...f, [k]: e.target.value });
  const setMedia = (key, value) => setF((current) => ({ ...current, [key]: value }));
  const setMediaUrl = (url, mediaType) => {
    setF((current) => ({
      ...current,
      heroMediaType: mediaType,
      [mediaType === 'video' ? 'heroVideo' : 'heroImage']: url,
    }));
  };
  async function applyUploadedMedia(url, mediaType) {
    const updated = {
      ...formRef.current,
      heroMediaType: mediaType,
      [mediaType === 'video' ? 'heroVideo' : 'heroImage']: url,
    };
    formRef.current = updated;
    setF(updated);
    setSaving(true);
    try {
      if (await onSave(updated)) flash();
    } finally {
      setSaving(false);
    }
  }
  const field = (k, label, ph) => (
    <div><label className="admin-label">{label}</label><input className="admin-input" type="text" value={f[k] || ''} onChange={set(k)} placeholder={ph} /></div>
  );
  return (
    <div>
      <div className="admin-section-title">Hero Section</div>
      <div className="admin-grid">
        {field('heroHeading', 'Heading Text (optional)', 'KULTURE')}
        {field('heroTagline', 'Tagline', 'YOUTH INFLUENCE.')}
        {field('heroBtn1', 'Button 1 Label (optional)', 'Shop Drop')}
        {field('heroBtn2', 'Button 2 Label (optional)', 'View Lookbook')}
      </div>
      <div style={{ marginBottom: '1.5rem', maxWidth: 700 }}>
        <HeroMediaField
          type={f.heroMediaType || 'image'}
          image={f.heroImage || ''}
          video={f.heroVideo || ''}
          onTypeChange={(value) => setMedia('heroMediaType', value)}
          onMediaChange={applyUploadedMedia}
          onUrlChange={setMediaUrl}
          onBusyChange={setUploading}
        />
      </div>
      <div style={{ display: 'flex', gap: '1rem' }}>
        <button className="admin-save" disabled={saving || uploading} onClick={async () => {
          setSaving(true);
          try { if (await onSave(f)) flash(); }
          finally { setSaving(false); }
        }}>{saving ? 'Saving…' : uploading ? 'Uploading media…' : 'Save Hero'}</button>
        {saved && <span className="admin-saved">✓ SAVED</span>}
      </div>
    </div>
  );
}

export function LogoSection({ settings, onSave }) {
  const [logoUrl, setLogoUrl] = useState('');
  const [uploading, setUploading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [saved, flash] = useSaved();

  useEffect(() => setLogoUrl(settings.logoUrl || ''), [settings.logoUrl]);

  async function saveLogo() {
    if (uploading) return;
    setSaving(true);
    try {
      if (await onSave({ logoUrl })) flash();
    } finally {
      setSaving(false);
    }
  }

  return (
    <div>
      <div className="admin-section-title">Logo</div>
      <p className="logo-section-description">Upload a transparent PNG to use as the storefront logo in the navigation and footer.</p>
      <div className="logo-section-field">
        <LogoUploadField
          value={logoUrl}
          onChange={setLogoUrl}
          onBusyChange={setUploading}
        />
      </div>
      <div style={{ display: 'flex', gap: '1rem' }}>
        <button className="admin-save" disabled={saving || uploading} onClick={saveLogo}>
          {saving ? 'Saving…' : uploading ? 'Uploading logo…' : 'Save Logo'}
        </button>
        {saved && <span className="admin-saved">✓ SAVED</span>}
      </div>
    </div>
  );
}

export function LookbookSection({ settings, onSave }) {
  const [f, setF] = useState({});
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState({});
  const [saved, flash] = useSaved();
  useEffect(() => setF({
    lbTitle: settings.lbTitle || 'kulture',
    ...Object.fromEntries([1, 2, 3, 4].map((n) => [`lbImg${n}`, settings[`lbImg${n}`] || DEFAULT_LOOKBOOK[n - 1]])),
  }), [settings]);
  const labels = ['Image 1 (Large Left)', 'Image 2 (Top Right)', 'Image 3 (Bottom Right)', 'Image 4 (Small)'];
  const isUploading = Object.values(uploading).some(Boolean);
  async function saveLookbook() {
    if (isUploading) return;
    const inlineImages = [1, 2, 3, 4]
      .map((n) => f[`lbImg${n}`] || '')
      .filter((image) => image.startsWith('data:'));
    if (inlineImages.reduce((total, image) => total + image.length, 0) > 700_000) {
      alert('The uploaded images are too large to save together. Try smaller images or use image URLs.');
      return;
    }

    setSaving(true);
    try { if (await onSave(f)) flash(); }
    finally { setSaving(false); }
  }

  return (
    <div>
      <div className="admin-section-title">Lookbook</div>
      <div style={{ marginBottom: '1.5rem', maxWidth: 400 }}>
        <label className="admin-label">Section Title</label>
        <input className="admin-input" type="text" value={f.lbTitle || ''} onChange={(e) => setF({ ...f, lbTitle: e.target.value })} />
      </div>
      <div className="admin-grid">
        {labels.map((l, i) => {
          const k = `lbImg${i + 1}`;
          return (
            <ImageField
              key={k}
              label={l}
              value={f[k] || ''}
              maxDimension={600}
              quality={0.55}
              onChange={(value) => setF((current) => ({ ...current, [k]: value }))}
              onBusyChange={(value) => setUploading((current) => ({ ...current, [k]: value }))}
            />
          );
        })}
      </div>
      <div style={{ display: 'flex', gap: '1rem' }}>
        <button className="admin-save" disabled={saving || isUploading} onClick={saveLookbook}>{saving ? 'Saving…' : isUploading ? 'Optimizing image…' : 'Save Lookbook'}</button>
        {saved && <span className="admin-saved">✓ SAVED</span>}
      </div>
    </div>
  );
}
