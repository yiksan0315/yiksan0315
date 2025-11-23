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
            <CollapsibleTrigger className='flex items-center justify-start space-x-2 py-1 group'>
              <ChevronRight className='min-h-4 min-w-4 h-4 w-4 transform transition-transform group-data-[state=open]:rotate-90' />
              <Link
                href={item.url}
                className={cn(
                  'flex items-center space-x-2 py-1 pl-1 pr-2 rounded-md',
                  isActive ? 'bg-primary/20' : 'hover:bg-muted hover:underline'
                )}
              >
                <Folder className='min-h-4 min-w-4 w-4 h-4  text-sky-500' />

                <span>{name}</span>
              </Link>
            </CollapsibleTrigger>
            <CollapsibleContent>
              <div className='border-l border-muted-foreground/20 my-1'>
                {renderTree(item.children as MarkdownFile[])}
              </div>
            </CollapsibleContent>
          </Collapsible>
        );
      } else {
        return (
          <Link
            href={item.url}
            className={cn(
              'flex items-center space-x-2 py-2 pl-11 pr-2 rounded-md',
              isActive ? 'bg-primary/20' : 'hover:bg-muted hover:underline'
            )}
            key={item.url}
          >
            <FileText className='min-h-4 min-w-4 h-4 w-4 text-gray-500' />
            <span>{name}</span>
          </Link>
        );
      }
    });
  };

  return (
    <nav className='flex flex-col space-y-1'>
      <h2>Contents</h2>
      {renderTree(folderInfo)}
    </nav>
  );
};

export default FileTreeNav;
