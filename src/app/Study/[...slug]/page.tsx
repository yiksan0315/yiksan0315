import MarkdownRender from '@/components/blog/MarkdownRender';
import MaxWidthWrapper from '@/components/MaxWidthWrapper';
import { getDirectoryStructure, getFileContent } from '@/lib/markdown/getMdFiles';
import MarkdownFile from '@/types/MarkdownFile';
import { notFound } from 'next/navigation';
import path from 'path';

interface MarkdownPageProps {
  params: {
    slug: string[];
  };
}

function flattenTree(files: MarkdownFile[]): MarkdownFile[] {
  let fileList: MarkdownFile[] = [];
  for (const file of files) {
    if (file.type === 'image' || file.type === 'mdFile') {
      fileList.push(file);
    } else if (file.type === 'dir') {
      fileList = fileList.concat(flattenTree(file.children as MarkdownFile[]));
    }
  }
  return fileList;
}

export async function generateStaticParams() {
  const StudyFolder = process.env.MD_STUDY_DIR as string;
  const files: MarkdownFile[] = await getDirectoryStructure(StudyFolder); // root
  const flattenedTree: MarkdownFile[] = flattenTree(files);
  return flattenedTree.map((item: MarkdownFile) => {
    return {
      slug: item.path.replace(StudyFolder, '').split('/'),
    };
  });
}

export default async function MarkdownPage({ params }: MarkdownPageProps) {
  const StudyFolder = process.env.MD_STUDY_DIR as string;
  const url = params.slug.join('/');
  const filePath = path.join(StudyFolder, url).replaceAll('%20', ' ');
  const fileName = url.split('/').pop() ?? '';

  try {
    const content = await getFileContent(filePath);

    if (typeof content === 'string') {
      if (fileName.endsWith('.md')) {
        return (
          <MaxWidthWrapper className=''>
            <MarkdownRender fileName={fileName} url={url}>
              {content as string}
            </MarkdownRender>
          </MaxWidthWrapper>
        );
      } else if (fileName.endsWith('.png')) {
        console.log('png file not implemented');
        <div>image file not implemented yet</div>;
      }
    } else {
      return (
        <MaxWidthWrapper className=''>
          {content.map((item) => {
            return <div key={item}>{item}</div>;
          })}
        </MaxWidthWrapper>
      );
    }
  } catch (error) {
    /**
     * if file not exist, treat as not found error
     * : to be consided again
     */
    console.log(error);
    notFound();
  }
}

/** Rerender markdown file per 1 hour(=3600s) */
export const revalidate = 3600;
