'use client';
import { useState } from 'react';
import { compressImage } from '@/lib/utils';

export default function ImageField({ label, value, onChange, onBusyChange, maxDimension = 1000, quality = 0.8 }) {
  const [mode, setMode] = useState('url');
  const [drag, setDrag] = useState(false);
  const [fileName, setFileName] = useState('');
  const [busy, setBusy] = useState(false);

  async function handleFile(file) {
    if (!file) return;
    if (!file.type.startsWith('image/')) {
      alert('Please choose an image file.');
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      alert('Image must be under 5MB.');
      return;
    }

    setBusy(true);
    onBusyChange?.(true);
    try {
      onChange(await compressImage(file, maxDimension, quality));
      setFileName(file.name);
    } catch (error) {
      console.error('Could not process image:', error);
      alert('Could not process this image. Please try another file.');
    } finally {
      setBusy(false);
      onBusyChange?.(false);
    }
  }

  return (
    <div className="pf-field">
      <label>{label}</label>
      <div className="img-input-tabs">
        <button type="button" className={`img-tab ${mode === 'url' ? 'active' : ''}`} onClick={() => setMode('url')}>URL</button>
        <button type="button" className={`img-tab ${mode === 'file' ? 'active' : ''}`} onClick={() => setMode('file')}>Upload</button>
      </div>
      {mode === 'url' ? (
        <input
          type="text"
          placeholder="https://..."
          value={value.startsWith('data:') ? '' : value}
          onChange={(event) => onChange(event.target.value)}
        />
      ) : (
        <>
          <div
            className={`drop-zone ${drag ? 'dragover' : ''}`}
            onDragOver={(event) => { event.preventDefault(); setDrag(true); }}
            onDragLeave={() => setDrag(false)}
            onDrop={(event) => {
              event.preventDefault();
              setDrag(false);
              handleFile(event.dataTransfer.files[0]);
            }}
          >
            <input
              type="file"
              accept="image/*"
              disabled={busy}
              onChange={(event) => {
                handleFile(event.target.files[0]);
                event.target.value = '';
              }}
            />
            <div className="drop-zone-icon">{busy ? '…' : '+'}</div>
            <p><strong>{busy ? 'Optimizing image…' : 'Click or drag & drop'}</strong><span>JPG, PNG, WEBP · Max 5MB</span></p>
          </div>
          {fileName && <div className="file-chosen">✓ {fileName}</div>}
        </>
      )}
      {value && <img className="pf-preview" src={value} alt={`${label} preview`} />}
    </div>
  );
}
