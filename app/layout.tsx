import type { Metadata } from "next";
import { IBM_Plex_Mono, IBM_Plex_Sans, Source_Serif_4 } from "next/font/google";
import "./globals.css";

const ibmSans = IBM_Plex_Sans({
  variable: "--font-ibm-sans",
  subsets: ["latin"],
  weight: ["400", "500", "600"],
});

const ibmMono = IBM_Plex_Mono({
  variable: "--font-ibm-mono",
  subsets: ["latin"],
  weight: ["400", "500"],
});

const sourceSerif = Source_Serif_4({
  variable: "--font-source-serif",
  subsets: ["latin"],
  weight: ["600"],
});

export const metadata: Metadata = {
  title: "Contactos · Miralvento",
  description: "Ficha de contactos de Miralvento Gestión Inmobiliaria",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="es"
      className={`${ibmSans.variable} ${ibmMono.variable} ${sourceSerif.variable} h-full antialiased`}
    >
      <body className="min-h-dvh bg-canvas text-ink">{children}</body>
    </html>
  );
}
