import MaxWidthWrapper from '@/components/MaxWidthWrapper';
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
    <MaxWidthWrapper className='flex-grow flex-1'>{children}</MaxWidthWrapper>
  );
}
