import MaxWidthWrapper from '@/components/MaxWidthWrapper';
import MarkdownRender from '@/components/Study/MarkdownRender';
import { getFolderInfo, getMdFileContent, isMarkdownFile } from '@/lib/markdown/getMdFiles';
import MarkdownFile from '@/types/MarkdownFile';
import PageProps from '@/types/PageProps';

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
  const files: MarkdownFile[] = await getFolderInfo(StudyFolder, true); // root
  const flattenedTree: MarkdownFile[] = flattenTree(files);
  return flattenedTree.map((item: MarkdownFile) => {
    // slug: path to file, split by '/' : without 'Study' path
    const slug_url = item.url.replace('Study' + '/', '').split('/');
    return {
      slug: slug_url,
    };
  });
}

export default async function MarkdownPage({ params }: PageProps) {
  const StudyFolder = process.env.MD_STUDY_DIR as string;
  const url = params.slug.join('/');
  const fileUrl = decodeURIComponent(StudyFolder + '/' + url);
  const fileName = fileUrl.split('/').pop() ?? ''; // last element of path : name

  try {
    if (isMarkdownFile(fileName)) {
      const content = await getMdFileContent(fileUrl);
      const urlToSameFolder = url.split('/').slice(0, -1).join('/');
      const newContent = transformImageLinks(content, `/api/Study-img/${urlToSameFolder}`);
      return (
        <MaxWidthWrapper>
          <MarkdownRender fileName={fileName} url={url}>
            {newContent}
          </MarkdownRender>
        </MaxWidthWrapper>
      );
    } else {
      // if folder
      const folderInfo = await getFolderInfo(fileUrl);
      return (
        <MaxWidthWrapper className=''>
          {folderInfo.map((item) => {
            return <div key={item.url}>{item.name}</div>;
          })}
        </MaxWidthWrapper>
      );
    }
  } catch (error) {
    /**
     * if file not exist, treat as not found error
     * : to be considered again
     */
    console.error(error);
    // notFound();

    return <MaxWidthWrapper className=''>not found error</MaxWidthWrapper>;
  }
}

export const revalidate = 60; // 1 minute
