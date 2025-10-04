/* eslint-disable @next/next/no-page-custom-font */
import { Inter } from "next/font/google";
import "leaflet/dist/leaflet.css";
import "./globals.css";
import { Analytics } from "@vercel/analytics/react";
import { GoogleMapsProvider } from "@/context/GoogleMapsProvider"; // ✅ adiciona aqui

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });

export const metadata = {
  title: "Tridentine Mass",
  description: "Tridentine Mass",
};

export default function RootLayout({ children }) {
  return (
    <html lang="pt-BR" style={{ colorScheme: "light" }}>
      <head>
        {/* Força modo claro e impede zoom no mobile */}
        <meta name="color-scheme" content="light" />
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Italianno&display=swap"
          rel="stylesheet"
        />

        {/* Google Analytics GA4 */}
        <script
          async
          src="https://www.googletagmanager.com/gtag/js?id=G-E75C2P2Y7Y"
        ></script>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag('js', new Date());
              gtag('config', 'G-E75C2P2Y7Y', {
                page_path: window.location.pathname,
              });
            `,
          }}
        />

        {/* Bloqueia zoom no desktop */}
        <script
          dangerouslySetInnerHTML={{
            __html: `
              window.addEventListener('wheel', function(e) {
                if (e.ctrlKey) e.preventDefault();
              }, { passive: false });

              window.addEventListener('keydown', function(e) {
                if (e.ctrlKey && (e.key === '+' || e.key === '-' || e.key === '=')) {
                  e.preventDefault();
                }
              });
            `,
          }}
        />
      </head>

      <body className={`${inter.variable} antialiased bg-white fullscreen`}>
        {/* ✅ Envolve tudo com o provider global do Google Maps */}
        <GoogleMapsProvider>{children}</GoogleMapsProvider>
        <Analytics /> {/* Vercel Analytics */}
      </body>
    </html>
  );
}
