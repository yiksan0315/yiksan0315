import MaxWidthWrapper from '@/components/MaxWidthWrapper';
import FolderContainer from '@/components/Study/FolderContainer';
import { getFolderInfo } from '@/lib/markdown/getMdFiles';
import MarkdownFile from '@/types/MarkdownFile';

export default async function Page() {
  const StudyFolder = process.env.MD_STUDY_DIR as string;
  const folderInfo: MarkdownFile[] = await getFolderInfo(StudyFolder);
  return (
    <MaxWidthWrapper className='font-RIDIFont'>
      <div className='w-[876px] mx-auto bg-gray-50 p-10 '>
        <h1 className='text-4xl font-extrabold mt-6 mb-2'>Study</h1>
        <p>Studies for AI, Data science, Mathematics, Mechnical Engineering...</p>
        {folderInfo.map((item) => {
          return <FolderContainer key={item.url}>{item}</FolderContainer>;
        })}
      </div>
    </MaxWidthWrapper>
  );
}

const revalidate = 3600;
