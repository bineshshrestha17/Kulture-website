import { addDoc, collection, deleteDoc, doc, getDocs, updateDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { DEFAULT_PRODUCTS } from '@/lib/utils';

export async function loadProducts() {
  try {
    const snap = await getDocs(collection(db, 'products'));
    if (snap.empty) {
      // First run: put the default products into Firestore
      const out = [];
      for (const p of DEFAULT_PRODUCTS) {
        try {
          const ref = await addDoc(collection(db, 'products'), { ...p, sortOrder: p.id });
          out.push({ ...p, _docId: ref.id });
        } catch { out.push(p); }
      }
      return out;
    }
    return snap.docs
      .map((d) => ({ _docId: d.id, ...d.data() }))
      .sort((a, b) => (a.sortOrder || 0) - (b.sortOrder || 0));
  } catch (e) {
    console.warn('Could not load products, using defaults:', e);
    return DEFAULT_PRODUCTS;
  }
}

export async function saveProduct(product) {
  if (product._docId) {
    const { _docId, ...data } = product;
    await updateDoc(doc(db, 'products', _docId), data);
    return product;
  }
  const sortOrder = Date.now();
  const data = { ...product, id: sortOrder, sortOrder };
  const ref = await addDoc(collection(db, 'products'), data);
  return { ...data, _docId: ref.id };
}

export async function removeProduct(product) {
  if (product._docId) await deleteDoc(doc(db, 'products', product._docId));
}

export async function loadSettings() {
  try {
    const snap = await getDocs(collection(db, 'settings'));
    if (snap.empty) return { _docId: null };
    return { _docId: snap.docs[0].id, ...snap.docs[0].data() };
  } catch (e) {
    console.warn('Could not load site settings:', e);
    return { _docId: null };
  }
}

export async function saveSettings(current, data) {
  if (current._docId) {
    await updateDoc(doc(db, 'settings', current._docId), data);
    return { ...current, ...data };
  }
  const ref = await addDoc(collection(db, 'settings'), data);
  return { ...current, ...data, _docId: ref.id };
}
