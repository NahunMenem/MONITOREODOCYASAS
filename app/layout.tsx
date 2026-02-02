import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "DocYa · Panel de Monitoreo",
  description: "Panel interno de monitoreo y operaciones de DocYa",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es" className="h-full">
      <head>
        {/* Viewport CORRECTO para mobile */}
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1, viewport-fit=cover"
        />
      </head>

      <body
        className={`
          ${geistSans.variable}
          ${geistMono.variable}
          antialiased
          min-h-screen
          bg-[#0F2027]
          text-white
          overflow-x-hidden
        `}
      >
        {children}
      </body>
    </html>
  );
}
