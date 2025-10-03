/* eslint-disable @next/next/no-page-custom-font */
import { Inter } from "next/font/google";
import "leaflet/dist/leaflet.css";
import "./globals.css";
import { Analytics } from "@vercel/analytics/react"; // ✅ Importa o Analytics

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });

export const metadata = {
  title: "Tridentine Mass",
  description: "Tridentine Mass",
};

export default function RootLayout({ children }) {
  return (
    <html lang="pt-BR" style={{ colorScheme: "light" }}>
      <head>
        <meta name="color-scheme" content="light" />
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Italianno&display=swap"
          rel="stylesheet"
        />
        <script
          dangerouslySetInnerHTML={{
            __html: `
              // Bloqueia zoom com Ctrl + + / Ctrl + - e scroll no desktop
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
        {children}
        <Analytics />
      </body>
    </html>
  );
}
