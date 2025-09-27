import type { Metadata } from "next";
import { Poppins } from "next/font/google";
import "./globals.css";

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-poppins",
});

export const metadata: Metadata = {
  title: "Omega Jastip Lubuklinggau - Layanan Jasa Titip & Antar Jemput Terpercaya",
  description: "Omega Jastip Lubuklinggau - Layanan jasa titip terpercaya di Lubuk Linggau. Antar makanan, barang, penumpang, jasa belanja dengan cepat dan aman. Pesan sekarang!",
  keywords: "jastip lubuklinggau, jasa titip lubuk linggau, antar jemput lubuk linggau, layanan kurir lubuklinggau, jasa belanja lubuk linggau, antar makanan lubuklinggau, omega jastip, jasa antar barang lubuk linggau",
  robots: "index, follow",
  alternates: {
    canonical: "https://omegajastip.online",
  },
  openGraph: {
    title: "Omega Jastip Lubuklinggau - Layanan Antar Jemput Terpercaya",
    description: "Layanan jasa titip terpercaya di Lubuk Linggau. Antar makanan, barang, penumpang, jasa belanja dengan cepat dan aman.",
    url: "https://omegajastip.online",
    type: "website",
    images: [
      {
        url: "https://omegajastip.online/images/logo.png",
        width: 1200,
        height: 630,
        alt: "Omega Jastip Lubuklinggau Logo",
      },
    ],
    locale: "id_ID",
  },
  twitter: {
    card: "summary_large_image",
    title: "Omega Jastip Lubuklinggau - Layanan Antar Jemput Terpercaya",
    description: "Layanan jasa titip terpercaya di Lubuk Linggau. Antar makanan, barang, penumpang, jasa belanja dengan cepat dan aman.",
    images: ["https://omegajastip.online/images/logo.png"],
  },
  other: {
    "google-site-verification": "sd71q3L_4g7bQSz_XJoA4NUd1KeFc_PyZN6uJ6kS",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="id">
      <head>
        <meta name="theme-color" content="#ee4d2d" />
        <meta name="google-adsense-account" content="ca-pub-9683887369443910" />
        <link rel="icon" type="image/png" href="/images/logo.png" />
        <link rel="manifest" href="/manifest.json" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          rel="preload"
          href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css"
          as="style"
        />
        <noscript>
          <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css" />
        </noscript>
        <link rel="stylesheet" href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css" />
        <link rel="stylesheet" href="/css/style.css" />
        <script async src="https://www.googletagmanager.com/gtag/js?id=G-QZKX5NKXFH"></script>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag('js', new Date());
              gtag('config', 'G-QZKX5NKXFH');
            `,
          }}
        />
        <script
          src="https://www.gstatic.com/firebasejs/9.22.0/firebase-app-compat.js"
          defer
        />
        <script
          src="https://www.gstatic.com/firebasejs/9.22.0/firebase-messaging-compat.js"
          defer
        />
        <script
          dangerouslySetInnerHTML={{
            __html: `
              const firebaseConfig = {
                apiKey: "AIzaSyDgk_2BLj-p2bbCNleQZFbI1dzsMH5omzo",
                authDomain: "botwa-99954.firebaseapp.com",
                databaseURL: "https://botwa-99954-default-rtdb.asia-southeast1.firebasedatabase.app",
                projectId: "botwa-99954",
                storageBucket: "botwa-99954.firebasestorage.app",
                messagingSenderId: "1003488855126",
                appId: "1:1003488855126:web:31a4b0938244e11d3c27f7",
                measurementId: "G-4LFXCXK7YG"
              };
              firebase.initializeApp(firebaseConfig);
              window.firebaseMessaging = firebase.messaging();
            `,
          }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "LocalBusiness",
              "name": "Omega Jastip Lubuklinggau",
              "description": "Layanan jasa titip dan antar jemput terpercaya di Lubuk Linggau",
              "url": "https://omegajastip.online",
              "telephone": "+62895700341213",
              "email": "Jastipomega@gmail.com",
              "address": {
                "@type": "PostalAddress",
                "streetAddress": "Jalan Teladan RT 1 no 08 Sebelum Kantor Lurah, Bandung Kiri",
                "addressLocality": "Lubuk Linggau",
                "addressRegion": "Sumatera Selatan",
                "postalCode": "31611",
                "addressCountry": "ID"
              },
              "geo": {
                "@type": "GeoCoordinates",
                "latitude": "-3.2945",
                "longitude": "102.8614"
              },
              "openingHours": "Mo-Su 07:00-21:00",
              "priceRange": "Rp 10.000 - Rp 50.000",
              "image": "https://omegajastip.online/images/logo.png",
              "serviceType": "Delivery service",
              "areaServed": "Lubuk Linggau dan sekitarnya",
              "sameAs": [
                "https://www.instagram.com/omega_jastip_lubuklinggau/",
                "https://wa.me/62895700341213",
                "https://www.tiktok.com/@jastipomega"
              ]
            }),
          }}
        />
      </head>
      <body className={`${poppins.variable} antialiased`}>
        {children}
        <script src="https://unpkg.com/leaflet@1.9.4/dist/leaflet.js" defer />
        <script src="/js/script.js" defer />
        <script src="/js/notifications.js" defer />
        <script src="/js/protection.js" defer />
        <script
          dangerouslySetInnerHTML={{
            __html: `
              document.addEventListener('DOMContentLoaded', function() {
                if (window.NotificationManager) {
                  window.NotificationManager.init();
                }
              });
            `,
          }}
        />
      </body>
    </html>
  );
}
