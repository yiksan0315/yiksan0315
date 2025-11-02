import FileTreeNav from '@/components/Study/FileTreeNav';
import { SidebarContainer } from '@/containers/Study/SidebarContainer';
import { getFolderInfo } from '@/lib/markdown/getMdFiles';
import '@styles/globals.css';
import type { Metadata } from 'next';

// export const metadata: Metadata = {
//   title: "yiksan0315's blog",
//   description: 'dev and study of yiksan0315',
// };

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const sideBarFolderInfo = await getFolderInfo('', true); // for hydration, get full tree
  return (
    <div className='flex flex-row'>
      <SidebarContainer sidebarNav={<FileTreeNav folderInfo={sideBarFolderInfo} />} />
      {children}
    </div>
  );
}
