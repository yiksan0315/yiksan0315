import NavFolder from '@/components/blog/NavFolder';
import '@styles/globals.css';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: "yiksan0315's blog",
  description: 'dev and study of yiksan0315',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className='flex flex-row'>
      <NavFolder />
      {children}
    </div>
  );
}
