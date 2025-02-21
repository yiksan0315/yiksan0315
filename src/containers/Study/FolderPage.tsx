import FolderContainer from '@/components/Study/FolderContainer';
import UrlLinkComponent from '@/components/Study/UrlLinkComponent';
import MarkdownFile from '@/types/MarkdownFile';

const FolderPage = ({ children, fileName, url }: { children: MarkdownFile[]; fileName: string; url: string }) => {
  const fileUrl = decodeURIComponent(url);
  return (
    <div className='w-[876px] mx-auto bg-gray-50 p-10 font-RIDIFont'>
      <h1 className='text-4xl font-extrabold mt-6 mb-2'>{fileName}</h1>
      <UrlLinkComponent>{fileUrl}</UrlLinkComponent>
      {children.map((item) => {
        return <FolderContainer key={item.url}>{item}</FolderContainer>;
      })}
    </div>
  );
};

export default FolderPage;
