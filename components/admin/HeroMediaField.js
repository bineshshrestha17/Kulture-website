'use client';
import { useRef, useState } from 'react';
import { getDownloadURL, ref, uploadBytesResumable } from 'firebase/storage';
import { storage } from '@/lib/firebase';

const MAX_IMAGE_SIZE = 10 * 1024 * 1024;
const MAX_VIDEO_SIZE = 100 * 1024 * 1024;
const UPLOAD_TIMEOUT_MS = 120_000;

export default function HeroMediaField({ type, image, video, onTypeChange, onMediaChange, onUrlChange, onBusyChange }) {
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState('');
  const [uploading, setUploading] = useState(false);
  const [checkingStorage, setCheckingStorage] = useState(false);
  const timeoutRef = useRef(null);
  const uploadRef = useRef(null);
  const currentUrl = type === 'video' ? video : image;

  async function uploadFile(file) {
    setError('');
    setProgress(0);
    if (!file) return;

    const isImage = file.type.startsWith('image/');
    const isVideo = file.type.startsWith('video/');
    if ((type === 'image' && !isImage) || (type === 'video' && !isVideo)) {
      setError(`Choose a ${type} file.`);
      return;
    }

    const limit = type === 'image' ? MAX_IMAGE_SIZE : MAX_VIDEO_SIZE;
    if (file.size > limit) {
      setError(`File is too large. Maximum ${type} size is ${type === 'image' ? '10MB' : '100MB'}.`);
      return;
    }

    setUploading(true);
    setCheckingStorage(true);
    onBusyChange(true);

    let storageCheckTimeout;
    try {
      const bucket = storage.app.options.storageBucket;
      if (!bucket) {
        throw Object.assign(new Error('No Firebase Storage bucket is configured.'), { code: 'storage/bucket-not-found' });
      }
      const bucketUrl = new URL(`https://firebasestorage.googleapis.com/v0/b/${encodeURIComponent(bucket)}/o`);
      bucketUrl.searchParams.set('maxResults', '1');
      bucketUrl.searchParams.set('prefix', 'hero/');
      const checkController = new AbortController();
      await Promise.race([
        fetch(bucketUrl, { cache: 'no-store', signal: checkController.signal }).then((response) => {
          if (response.status === 404) {
            throw Object.assign(new Error(`Firebase Storage bucket "${bucket}" does not exist. Create a bucket in Firebase Console > Storage, set NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET to its exact name, restart the app, and publish storage.rules.`), { code: 'storage/bucket-not-found' });
          }
          if (response.status === 401 || response.status === 403) {
            throw Object.assign(new Error('Firebase Storage access is denied. Publish storage.rules in Firebase Console > Storage > Rules, then retry.'), { code: 'storage/unauthorized' });
          }
          if (!response.ok) {
            throw new Error(`Firebase Storage check failed with HTTP ${response.status}.`);
          }
        }),
        new Promise((_, reject) => {
          storageCheckTimeout = setTimeout(() => {
            checkController.abort();
            reject(new Error('Firebase Storage check timed out. Check your connection and Storage setup.'));
          }, 15_000);
        }),
      ]);
    } catch (storageError) {
      console.error('Firebase Storage is not ready:', storageError);
      const message = storageError.code === 'storage/bucket-not-found'
        ? `Firebase Storage bucket "${storage.app.options.storageBucket}" does not exist. Create a bucket in Firebase Console > Storage, set NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET to its exact name, restart the app, and publish storage.rules.`
        : storageError.code === 'storage/unauthorized'
          ? 'Firebase Storage access is denied. Publish storage.rules in Firebase Console > Storage > Rules, then retry.'
          : storageError.message || 'Could not connect to Firebase Storage. Check the bucket configuration and connection.';
      setError(message);
      setUploading(false);
      setCheckingStorage(false);
      onBusyChange(false);
      return;
    } finally {
      clearTimeout(storageCheckTimeout);
    }

    setCheckingStorage(false);
    let task;
    let settled = false;
    const finish = () => {
      if (settled) return;
      settled = true;
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
      uploadRef.current = null;
      setUploading(false);
      onBusyChange(false);
    };
    const startTimeout = (message) => {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = setTimeout(() => {
        task?.cancel();
        setError(message);
        finish();
      }, UPLOAD_TIMEOUT_MS);
    };

    try {
      const safeName = file.name.replace(/[^a-zA-Z0-9._-]/g, '_');
      const objectRef = ref(storage, `hero/${Date.now()}-${safeName}`);
      task = uploadBytesResumable(objectRef, file, { contentType: file.type });
      uploadRef.current = task;
      startTimeout('Upload timed out. Check your connection, Firebase Storage availability, and Storage rules, then retry.');
      task.on(
        'state_changed',
        (snapshot) => {
          if (settled) return;
          setProgress(Math.round((snapshot.bytesTransferred / snapshot.totalBytes) * 100));
          if (snapshot.bytesTransferred > 0) {
            startTimeout('Upload stalled. Check your connection and Firebase Storage setup, then retry.');
          }
        },
        (uploadError) => {
          if (settled) return;
          console.error('Hero media upload failed:', uploadError);
          if (uploadError.code !== 'storage/canceled') {
            const message = uploadError.code === 'storage/unauthorized'
              ? 'Upload denied. Publish the admin-only storage.rules in Firebase Storage.'
              : uploadError.code === 'storage/bucket-not-found'
                ? 'Firebase Storage bucket was not found. Check the Storage bucket in Firebase Console and your app configuration.'
                : uploadError.code === 'storage/retry-limit-exceeded'
                  ? 'Upload stopped after repeated network failures. Check your connection and try again.'
                  : uploadError.message || 'Upload failed. Check Firebase Storage setup and try again.';
            setError(message);
          }
          finish();
        },
        async () => {
          if (settled) return;
          startTimeout('Upload completed, but loading its download URL timed out. Check your connection and retry.');
          try {
            const url = await getDownloadURL(task.snapshot.ref);
            if (settled) return;
            onMediaChange(url, type);
            setProgress(100);
            finish();
          } catch (downloadError) {
            if (settled) return;
            console.error('Could not get uploaded hero media URL:', downloadError);
            setError(downloadError.message || 'Upload completed, but its URL could not be loaded.');
            finish();
          }
        },
      );
    } catch (uploadError) {
      console.error('Could not start hero media upload:', uploadError);
      setError(uploadError.message || 'Could not start upload. Check Firebase Storage configuration.');
      finish();
    }
  }

  function cancelUpload() {
    uploadRef.current?.cancel();
    setError('Upload canceled.');
  }

  return (
    <div className="hero-media-field">
      <label className="admin-label">Hero Media</label>
      <div className="img-input-tabs">
        <button type="button" className={`img-tab ${type === 'image' ? 'active' : ''}`} disabled={uploading} onClick={() => onTypeChange('image')}>Image</button>
        <button type="button" className={`img-tab ${type === 'video' ? 'active' : ''}`} disabled={uploading} onClick={() => onTypeChange('video')}>Video</button>
      </div>
      <div className="hero-media-controls">
        <input
          className="admin-input"
          type="text"
          value={currentUrl || ''}
          placeholder={type === 'video' ? 'Video URL or uploaded video' : 'Image URL or uploaded image'}
          onChange={(event) => onUrlChange(event.target.value, type)}
        />
        <label className="hero-upload-button">
          {checkingStorage ? 'Checking storage…' : uploading ? `Uploading ${progress}%` : `Upload ${type}`}
          <input
            type="file"
            accept={type === 'video' ? 'video/*' : 'image/*'}
            disabled={uploading}
            onChange={(event) => {
              uploadFile(event.target.files[0]);
              event.target.value = '';
            }}
          />
        </label>
      </div>
      <p className="hero-media-hint">
        {type === 'video' ? 'MP4, WebM, or other browser-supported video · Max 100MB' : 'JPG, PNG, WEBP, or other browser-supported image · Max 10MB'}
      </p>
      {uploading && !checkingStorage && <progress className="hero-upload-progress" value={progress} max="100" aria-label="Upload progress" />}
      {uploading && !checkingStorage && <button className="hero-upload-cancel" type="button" onClick={cancelUpload}>Cancel upload</button>}
      {error && <p className="hero-upload-error" role="alert">{error}</p>}
      {currentUrl && (
        <div className="hero-media-preview">
          {type === 'video'
            ? <video src={currentUrl} controls preload="metadata" />
            : <img src={currentUrl} alt="Hero media preview" />}
        </div>
      )}
    </div>
  );
}
