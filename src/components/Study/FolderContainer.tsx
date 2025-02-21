import MarkdownFile from '@/types/MarkdownFile';
import Image from 'next/image';
import Link from 'next/link';
import { removeExt } from '../../lib/markdown/remakeMarkdown';

const FolderContainer = ({ children }: { children: MarkdownFile }) => {
  return (
    <div className='p-2 my-6 bg-slate-100 rounded-md'>
      <Link href={'/' + children.url} className='flex flew-row'>
        <div className='p-4 bg-slate-200 rounded-lg mr-4'>
          {children.type === 'file' ? (
            <Image src='/images/markdown.png' alt='file' width={40} height={40} />
          ) : (
            <Image src='/images/folder.png' alt='folder' width={40} height={40} />
          )}
        </div>
        <div>
          <h2 className='text-2xl font-bold mb-2 '>{removeExt(children.name)}</h2>
          <p>metadata...</p>
        </div>
      </Link>
    </div>
  );
};

export default FolderContainer;
