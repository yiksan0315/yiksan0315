import FileTreeNav from '@/components/Study/FileTreeNav';
import SidebarContainer from '@/containers/Study/SidebarContainer';
import { getFolderInfo } from '@/lib/markdown/getMdFiles';
import '@styles/globals.css';

// export const metadata: Metadata = {
//   title: "yiksan0315's blog",
//   description: 'dev and study of yiksan0315',
// };

export default async function StudyLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const sideBarFolderInfo = await getFolderInfo('', true); // for hydration, get full tree
  const sidebarNav = <FileTreeNav folderInfo={sideBarFolderInfo} />; // Pass the navigation component as server-rendered React node
  return (
    <div className='flex flex-row'>
      <SidebarContainer sidebarNav={sidebarNav} />
      {children}
    </div>
  );
}
