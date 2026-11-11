'use client';
import { useState } from 'react';
import { getDownloadURL, ref, uploadBytesResumable } from 'firebase/storage';
import { storage } from '@/lib/firebase';

const MAX_LOGO_SIZE = 5 * 1024 * 1024;

export default function LogoUploadField({ value, onChange, onBusyChange }) {
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState('');

  function uploadFile(file) {
    setError('');
    if (!file) return;
    if (file.type !== 'image/png') {
      setError('Please choose a PNG image so the logo transparency is preserved.');
      return;
    }
    if (file.size > MAX_LOGO_SIZE) {
      setError('Logo must be under 5MB.');
      return;
    }

    const objectRef = ref(storage, `logos/${Date.now()}-${file.name.replace(/[^a-zA-Z0-9._-]/g, '_')}`);
    const task = uploadBytesResumable(objectRef, file, { contentType: 'image/png' });
    onBusyChange(true);
    setProgress(0);
    task.on(
      'state_changed',
      (snapshot) => setProgress(Math.round((snapshot.bytesTransferred / snapshot.totalBytes) * 100)),
      (uploadError) => {
        console.error('Logo upload failed:', uploadError);
        setError(uploadError.message || 'Logo upload failed. Check Firebase Storage permissions and try again.');
        onBusyChange(false);
      },
      async () => {
        try {
          onChange(await getDownloadURL(task.snapshot.ref));
          setProgress(100);
        } catch (downloadError) {
          console.error('Could not get uploaded logo URL:', downloadError);
          setError(downloadError.message || 'Upload completed, but its URL could not be loaded.');
        } finally {
          onBusyChange(false);
        }
      },
    );
  }

  return (
    <div className="logo-upload-field">
      <label className="admin-label">Logo PNG</label>
      <div className="hero-media-controls">
        <input
          className="admin-input"
          type="text"
          value={value || ''}
          placeholder="Upload a PNG or paste an image URL"
          onChange={(event) => onChange(event.target.value)}
        />
        <label className="hero-upload-button">
          {progress > 0 && progress < 100 ? `Uploading ${progress}%` : 'Upload PNG'}
          <input
            type="file"
            accept="image/png,.png"
            disabled={progress > 0 && progress < 100}
            onChange={(event) => {
              uploadFile(event.target.files[0]);
              event.target.value = '';
            }}
          />
        </label>
      </div>
      <p className="hero-media-hint">Transparent PNG · Max 5MB</p>
      {progress > 0 && <progress className="hero-upload-progress" value={progress} max="100" aria-label="Logo upload progress" />}
      {error && <p className="hero-upload-error" role="alert">{error}</p>}
      {value && (
        <div className="logo-upload-preview">
          <img src={value} alt="Logo preview" />
        </div>
      )}
    </div>
  );
}
