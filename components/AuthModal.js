'use client';
import { useState } from 'react';
import { createUserWithEmailAndPassword, signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '@/lib/firebase';
import { friendlyAuthError } from '@/lib/utils';

export default function AuthModal({ open, onClose, onSuccess }) {
  const [tab, setTab] = useState('login');
  const [email, setEmail] = useState('');
  const [pass, setPass] = useState('');
  const [err, setErr] = useState('');
  const [ok, setOk] = useState('');
  const [busy, setBusy] = useState(false);

  const reset = () => { setErr(''); setOk(''); };

  async function submit() {
    reset();
    if (!email.trim() || !pass) return setErr('Enter email and password.');
    if (tab === 'signup' && pass.length < 6) return setErr('Password must be at least 6 characters.');
    setBusy(true);
    try {
      if (tab === 'login') {
        await signInWithEmailAndPassword(auth, email.trim(), pass);
        onClose(); setTimeout(onSuccess, 300);
      } else {
        await createUserWithEmailAndPassword(auth, email.trim(), pass);
        setOk('Account created! You can now track your orders.');
        setTimeout(() => { onClose(); onSuccess(); }, 1500);
      }
    } catch (e) { setErr(friendlyAuthError(e.code)); }
    setBusy(false);
  }

  const isLogin = tab === 'login';
  return (
    <div id="auth-modal" className={`overlay ${open ? 'active' : ''}`}>
      <div className="auth-box">
        <button className="auth-close" onClick={onClose}><i className="ri-close-line" /></button>
        <div className="auth-tabs">
          <div className={`auth-tab ${isLogin ? 'active' : ''}`} onClick={() => { setTab('login'); reset(); }}>Login</div>
          <div className={`auth-tab ${!isLogin ? 'active' : ''}`} onClick={() => { setTab('signup'); reset(); }}>Sign Up</div>
        </div>
        <h3>{isLogin ? 'WELCOME BACK' : 'JOIN KULTURE'}</h3>
        <p>{isLogin ? 'Login to track your orders.' : 'Create an account to track your drops.'}</p>
        <div className="auth-field"><label>Email</label><input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="your@email.com" /></div>
        <div className="auth-field"><label>Password</label><input type="password" value={pass} onChange={(e) => setPass(e.target.value)} placeholder={isLogin ? '••••••••' : 'Min 6 characters'} onKeyDown={(e) => e.key === 'Enter' && submit()} /></div>
        <button className="auth-submit" disabled={busy} onClick={submit}>{busy ? 'Please wait…' : isLogin ? 'Login' : 'Create Account'}</button>
        {err && <p className="auth-error">{err}</p>}
        {ok && <p className="auth-success">{ok}</p>}
      </div>
    </div>
  );
}
