import { getDirectoryStructure } from '@/lib/markdown/getMdFiles';
import MarkdownFile from '@/types/MarkdownFile';
import Link from 'next/link';

const TempComponent = ({
  name,
  dir,
  path,
  children,
}: {
  name: string;
  dir?: boolean;
  path?: string;
  children?: React.ReactNode;
}) => {
  if (dir) {
    return (
      <li className='p-2'>
        <strong>{name}</strong>
        {children}
      </li>
    );
  } else {
    return (
      <li className='p-2'>
        <Link href={'/' + (path as string)}>
          <div>{name}</div>
          {children}
        </Link>
      </li>
    );
  }
};

const NavFolder = async () => {
  const StudyFolder = process.env.MD_STUDY_DIR as string;
  const data: MarkdownFile[] = await getDirectoryStructure(StudyFolder);
  const imageFolder = 'attachments';

  const renderTree = (contents: MarkdownFile[]) => {
    return contents.map((item) => {
      if (item.name !== imageFolder) {
        if (item.type === 'dir') {
          // 폴더인 경우 재귀적으로 하위 폴더와 파일들을 렌더링
          return (
            <TempComponent key={item.path} name={item.name} dir>
              <ul className='border-black border-2'>
                {renderTree(
                  (item.children as MarkdownFile[]).filter(
                    (content) => content.path.startsWith(item.path) && content.path !== item.path
                  )
                )}
              </ul>
            </TempComponent>
          );
        } else {
          return <TempComponent key={item.path} name={item.name} path={item.path.replace(StudyFolder, 'Study')} />;
        }
      }
    });
  };

  return (
    <div className='bg-slate-200'>
      <ul>{renderTree(data)}</ul>
    </div>
  );
};

export default NavFolder;
