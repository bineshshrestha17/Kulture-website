# KULTURE (Next.js)

1. npm install
2. Copy .env.local.example to .env.local and fill in the values (optional, defaults are already in the code)
3. In the Firebase Console, create/enable a Firebase Storage bucket. Set `NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET` in `.env.local` to the exact bucket name shown under Storage > Files (the app's current fallback bucket may not exist). Publish `storage.rules` under Storage > Rules. In Admin > Hero, choose Image or Video, then upload a local file or enter a media URL.
4. npm run dev  (open http://localhost:3000)
5. Publish the rules in firestore.rules in Firebase Console > Firestore > Rules
