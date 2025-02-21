import MaxWidthWrapper from '@/components/MaxWidthWrapper';
import { getFolderInfo, getMdFileContent, isMarkdownFile } from '@/lib/markdown/getMdFiles';
import FolderPage from '@/pages/Study/FolderPage';
import MarkdownPage from '@/pages/Study/MarkdownPage';
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

export default async function Page({ params }: PageProps) {
  const StudyFolder = process.env.MD_STUDY_DIR as string;
  const url = params.slug.join('/');
  const fileUrl = decodeURIComponent(StudyFolder + '/' + url);
  const fileName = fileUrl.split('/').pop() as string; // last element of path : name

  try {
    if (isMarkdownFile(fileName)) {
      const content = await getMdFileContent(fileUrl);
      return (
        <MaxWidthWrapper className='bg-slate-100'>
          <MarkdownPage fileName={fileName} url={url}>
            {content}
          </MarkdownPage>
        </MaxWidthWrapper>
      );
    } else {
      // if folder : only markdown files or folders
      const folderInfo = await getFolderInfo(fileUrl);
      return (
        <MaxWidthWrapper>
          <FolderPage fileName={fileName} url={url}>
            {folderInfo}
          </FolderPage>
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
    return <MaxWidthWrapper className=''>404 not found error</MaxWidthWrapper>;
  }
}
