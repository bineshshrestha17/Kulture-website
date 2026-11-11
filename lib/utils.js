export function friendlyAuthError(code) {
  const map = {
    'auth/user-not-found': 'No account found with this email.',
    'auth/wrong-password': 'Incorrect password.',
    'auth/email-already-in-use': 'An account with this email already exists.',
    'auth/invalid-email': 'Invalid email address.',
    'auth/weak-password': 'Password is too weak.',
    'auth/too-many-requests': 'Too many attempts. Try again later.',
    'auth/invalid-credential': 'Invalid email or password.',
  };
  return map[code] || 'Authentication error. Please try again.';
}

export function formatDate(createdAt) {
  if (!createdAt) return '—';
  const d = createdAt.toDate ? createdAt.toDate() : new Date(createdAt);
  return d.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });
}

// Shrinks uploaded images so they fit inside a Firestore document (1MB limit)
export function compressImage(file, maxSize = 1000, quality = 0.8) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onerror = reject;
    reader.onload = () => {
      const img = new Image();
      img.onerror = reject;
      img.onload = () => {
        const scale = Math.min(1, maxSize / Math.max(img.width, img.height));
        const canvas = document.createElement('canvas');
        canvas.width = Math.round(img.width * scale);
        canvas.height = Math.round(img.height * scale);
        canvas.getContext('2d').drawImage(img, 0, 0, canvas.width, canvas.height);
        resolve(canvas.toDataURL('image/jpeg', quality));
      };
      img.src = reader.result;
    };
    reader.readAsDataURL(file);
  });
}

export const DEFAULT_PRODUCTS = [
  { id: 1, name: '001 Heavyweight Hoodie', price: 'Coming Soon', desc: 'Constructed from 450gsm organic French terry cotton. Dropped shoulders, cropped body, oversized sleeves. Distressed edges applied by hand in our Kathmandu studio. Washed for a vintage fade.', img1: 'https://images.unsplash.com/photo-1523398002811-999aa8e9f5be?q=80&w=800&auto=format&fit=crop', img2: 'https://images.unsplash.com/photo-1509942774463-acf339cf87d5?q=80&w=800&auto=format&fit=crop', status: 'coming', ig: 'https://instagram.com/Kulture_np' },
  { id: 2, name: 'Void Distressed Denim', price: 'Coming Soon', desc: 'Heavyweight raw selvedge denim, hand-distressed. Cut for an intentionally oversized silhouette. Each pair unique.', img1: 'https://images.unsplash.com/photo-1620799140408-edc6dcb6d633?q=80&w=800&auto=format&fit=crop', img2: 'https://images.unsplash.com/photo-1542272604-787c3835535d?q=80&w=800&auto=format&fit=crop', status: 'coming', ig: 'https://instagram.com/Kulture_np' },
  { id: 3, name: 'Rebel Oversized Tee', price: 'Coming Soon', desc: 'Screen-printed on 280gsm ringspun cotton. Pre-shrunk, garment-dyed. One size fits all outsiders.', img1: 'https://images.unsplash.com/photo-1556821840-3a63f95609a7?q=80&w=800&auto=format&fit=crop', img2: 'https://images.unsplash.com/photo-1576566588028-4147f3842f27?q=80&w=800&auto=format&fit=crop', status: 'coming', ig: 'https://instagram.com/Kulture_np' },
];

export const DEFAULT_LOOKBOOK = [
  'https://i.pinimg.com/1200x/ed/93/b6/ed93b680b8803703618aa1d1094ffcf6.jpg',
  'https://i.pinimg.com/1200x/6b/e4/93/6be49373fec0a239ff58bf78249c8d1b.jpg',
  'https://images.unsplash.com/photo-1492447105260-2e947425b5cc?q=80&w=800&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1506152983158-b4a74a01c721?q=80&w=800&auto=format&fit=crop',
];
