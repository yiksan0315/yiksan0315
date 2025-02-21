import { getFolderInfo } from '@/lib/markdown/getMdFiles';
import { removeExt } from '@/lib/markdown/remakeMarkdown';
import MarkdownFile from '@/types/MarkdownFile';
import Link from 'next/link';

const TempComponent = ({
  name,
  url,
  dir,
  children,
}: {
  name: string;
  url: string;
  dir?: boolean;
  children?: React.ReactNode;
}) => {
  if (dir) {
    return (
      <li className='p-2' key={url}>
        <Link href={'/' + url}>
          <strong>{name}</strong>
        </Link>
        {children}
      </li>
    );
  } else {
    return (
      <li className='p-2' key={url}>
        <Link href={'/' + url}>
          <div>{name}</div>
        </Link>
      </li>
    );
  }
};

const NavFolder = async () => {
  const renderTree = (contents: MarkdownFile[]) => {
    return contents.map((item) => {
      const name = removeExt(item.name);
      if (item.type === 'dir') {
        return (
          <TempComponent key={item.path} name={name} url={item.url} dir>
            <ul className='border-black border-2'>{renderTree(item.children as MarkdownFile[])}</ul>
          </TempComponent>
        );
      } else {
        return <TempComponent key={item.path} name={name} url={item.url} />;
      }
    });
  };

  const StudyFolder = process.env.MD_STUDY_DIR as string;
  try {
    const data: MarkdownFile[] = await getFolderInfo(StudyFolder, true);
    return (
      <aside className='bg-slate-200'>
        <ul>{renderTree(data)}</ul>
      </aside>
    );
  } catch (e) {
    console.error(e);
  }
};

export default NavFolder;
