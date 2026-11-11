import './globals.css';
import { AuthProvider } from '@/context/AuthContext';

export const metadata = {
  title: 'KULTURE — Kathmandu Streetwear',
  description: 'Independent streetwear, made in Kathmandu. Explore the latest KULTURE drop and editorial.',
};
export const viewport = { width: 'device-width', initialScale: 1 };

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        <link href="https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700&family=DM+Serif+Display:ital@0;1&family=Oswald:wght@400;500;700&family=Sedgwick+Ave+Display&display=swap" rel="stylesheet" />
        <link href="https://cdn.jsdelivr.net/npm/remixicon@3.5.0/fonts/remixicon.css" rel="stylesheet" />
      </head>
      <body><AuthProvider>{children}</AuthProvider></body>
    </html>
  );
}
