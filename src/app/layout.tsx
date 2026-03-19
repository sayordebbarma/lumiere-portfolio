import type { Metadata } from 'next';
import { Playfair_Display, DM_Mono } from 'next/font/google';
import SmoothScrollProvider from '@/components/SmoothScrollProvider';
import '@/app/globals.css';
import NavbarWrapper from "@/components/layout/NavbarWrapper";
import Footer from "@/components/layout/Footer";

const playfair = Playfair_Display({
  subsets: ['latin'],
  variable: '--font-display',
  display: 'swap',
});

const dmMono = DM_Mono({
  subsets: ['latin'],
  weight: ['300', '400', '500'],
  variable: '--font-mono',
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'Lumière — Visual Storytelling',
  description:
    'A cinematic photography and videography portfolio. Every frame, a story.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang='en' className={`${playfair.variable} ${dmMono.variable}`}>
      <body>
        <NavbarWrapper />
        <SmoothScrollProvider>{children}</SmoothScrollProvider>
        <Footer />
      </body>
    </html>
  );
}
