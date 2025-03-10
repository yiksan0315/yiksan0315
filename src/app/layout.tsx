import Footer from '@/components/Footer';
import Header from '@/components/Header';
import { cn } from '@/lib/utils';
import '@styles/globals.css';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'yiksan0315 Blog',
  description: 'dev and study of yiksan0315 | Deep Learning, Machine Learning, Web, Mechanical Engineering ...',
  openGraph: {
    title: 'yiksan0315 Blog',
    description: 'dev and study of yiksan0315 | Deep Learning, Machine Learning, Web, Mechanical Engineering ...',
    locale: 'ko_KR',
    type: 'website',
    siteName: 'yiksan0315 Blog',
    url: 'https://yiksan0315.vercel.app',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang='ko'>
      <body className={cn('relative h-full font-sans antialiased m-0', inter.className)}>
        <main className='relative flex flex-col min-h-screen'>
          <Header />
          <div className='flex-grow flex-1'>{children}</div>
          <Footer />
        </main>
      </body>
    </html>
  );
}
