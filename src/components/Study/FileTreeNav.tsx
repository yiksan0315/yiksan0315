'use client';
import { removeExt } from '@/lib/markdown/remakeMarkdown';
import MarkdownFile from '@/types/MarkdownFile';
import Link from 'next/link';
import { usePathname } from 'next/navigation'; // 현재 경로 확인
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { ChevronRight, Folder, FileText } from 'lucide-react';
import { cn } from '@/lib/utils'; // shadcn/ui의 유틸리티

const FileTreeNav = ({ folderInfo }: { folderInfo: MarkdownFile[] }) => {
  const pathname = usePathname();

  const renderTree = (contents: MarkdownFile[]) => {
    return contents.map((item) => {
      const name = removeExt(item.name);

      const isActive = decodeURIComponent(pathname) === item.url;
      if (item.type === 'dir') {
        return (
          <Collapsible defaultOpen={false} className='pl-4' key={item.url}>
            <CollapsibleTrigger className='flex items-center space-x-2 py-1 group'>
              <ChevronRight className='h-4 w-4 transform transition-transform group-data-[state=open]:rotate-90' />
              <Folder className='h-4 w-4 text-sky-500' />
              <Link
                href={item.url}
                className={cn(
                  'hover:bg-muted hover:underline',
                  isActive ? 'bg-primary/20 text-primary' : 'hover:bg-muted hover:underline'
                )}
              >
                {name}
              </Link>
            </CollapsibleTrigger>
            <CollapsibleContent>{renderTree(item.children as MarkdownFile[])}</CollapsibleContent>
          </Collapsible>
        );
      } else {
        console.log('Current Path:', pathname, ' | Item URL:', item.url, ' | isActive:', isActive);
        return (
          <Link
            href={item.url}
            className={cn(
              'flex items-center space-x-2 py-1 pl-12 pr-2 rounded-md',
              isActive ? 'bg-primary/20 text-primary' : 'hover:bg-muted hover:underline'
            )}
            key={item.url}
          >
            <FileText className='h-4 w-4 text-gray-500' />
            <span>{name}</span>
          </Link>
        );
      }
    });
  };

  return (
    <nav className='flex flex-col space-y-1'>
      <span>sidebar</span>
      {renderTree(folderInfo)}
    </nav>
  );
};

export default FileTreeNav;
