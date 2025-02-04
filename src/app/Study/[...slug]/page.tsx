import MarkdownRender from '@/components/blog/MarkdownRender';
import MaxWidthWrapper from '@/components/MaxWidthWrapper';
import { getDirectoryStructure, getFileContent, isMarkdownFile } from '@/lib/markdown/getMdFiles';
import MarkdownFile from '@/types/MarkdownFile';
import PageProps from '@/types/PageProps';
import path from 'path';

function flattenTree(files: MarkdownFile[]): MarkdownFile[] {
  let fileList: MarkdownFile[] = [];
  for (const file of files) {
    fileList.push(file);
    if (file.type === 'dir') {
      fileList = fileList.concat(flattenTree(file.children as MarkdownFile[]));
    }
  }
  return fileList;
}
function transformImageLinks(markdown: string, baseUrl: string): string {
  return markdown.replace(/!\[[^\]]*\]\(([^)]+)\)/g, (match, p1) => {
    const newUrl = `${baseUrl}/${p1}`;
    return match.replace(p1, newUrl);
  });
}

export async function generateStaticParams() {
  const StudyFolder = process.env.MD_STUDY_DIR as string;
  const files: MarkdownFile[] = await getDirectoryStructure(StudyFolder); // root
  const flattenedTree: MarkdownFile[] = flattenTree(files);
  return flattenedTree.map((item: MarkdownFile) => {
    const slug_path = item.path.replace(StudyFolder + path.sep, '').split('/');
    return {
      slug: slug_path,
    };
  });
}

export default async function MarkdownPage({ params }: PageProps) {
  const StudyFolder = process.env.MD_STUDY_DIR as string;
  const url = params.slug.join('/');
  const filePath = decodeURIComponent(path.join(StudyFolder, url));
  const fileName = filePath.split('/').pop() ?? '';

  try {
    const content = await getFileContent(filePath);

    if (typeof content === 'string') {
      if (isMarkdownFile(fileName)) {
        const urlToSameFolder = url.split('/').slice(0, -1).join('/');
        const newContent = transformImageLinks(content, `/api/Study-img/${urlToSameFolder}`);
        return (
          <MaxWidthWrapper className=''>
            <MarkdownRender fileName={fileName} url={url}>
              {newContent}
            </MarkdownRender>
          </MaxWidthWrapper>
        );
      } else {
        throw new Error('Not Found Error : Not a markdown file');
      }
    } else {
      // content is string[] : if directory
      return (
        <MaxWidthWrapper className=''>
          {(content as string[]).map((item) => {
            return <div key={item}>{item}</div>;
          })}
        </MaxWidthWrapper>
      );
    }
  } catch (error) {
    /**
     * if file not exist, treat as not found error
     * : to be considered again
     */
    console.log(error);
    // notFound();

    return <MaxWidthWrapper className=''>not found error</MaxWidthWrapper>;
  }
}

export const revalidate = 0;
