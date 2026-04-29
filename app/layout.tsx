import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import Navbar from '@/components/Navbar';
import CustomCursor from '@/components/CustomCursor';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-sans',
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'MediNest.ai — Your Health Story, Unified',
  description:
    'AI-powered healthcare record management. Upload reports, build care plans, and understand your health story in one place.',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={inter.variable}>
      <body className="font-sans antialiased selection:bg-violet-200/60 selection:text-violet-900">
        <CustomCursor />
        <Navbar />
        {children}
      </body>
    </html>
  );
}
