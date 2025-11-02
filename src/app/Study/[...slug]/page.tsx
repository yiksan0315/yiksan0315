import MaxWidthWrapper from '@/components/MaxWidthWrapper';
import { getFolderInfo, getMdFileContent, isMarkdownFile } from '@/lib/markdown/getMdFiles';
import FolderPage from '@/containers/Study/FolderPage';
import MarkdownPage from '@/containers/Study/MarkdownPage';
import MarkdownFile from '@/types/MarkdownFile';
import PageProps from '@/types/PageProps';
import { Metadata } from 'next';
import TocContainer from '@/containers/Study/TocContainer';

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
  const files: MarkdownFile[] = await getFolderInfo('', true); // root
  const flattenedTree: MarkdownFile[] = flattenTree(files);
  return flattenedTree.map((item: MarkdownFile) => {
    // slug: path to file, split by '/' : without 'Study' path
    const slug_url = item.url.replace('/Study' + '/', '').split('/');
    console.log('Generating static param for:', slug_url);
    return {
      slug: slug_url,
    };
  });
}

export default async function Page({ params }: PageProps) {
  const url = params.slug.join('/');
  const fileUrl = decodeURIComponent(url); // In real url, it includes escape sequence
  const fileName = fileUrl.split('/').pop() as string; // last element of path : name

  try {
    if (isMarkdownFile(fileName)) {
      const content = await getMdFileContent(fileUrl);
      return (
        <div className='container relative mx-auto p-4 lg:px-8'>
          <div className='flex flex-row justify-between'>
            <MarkdownPage fileName={fileName} url={url}>
              {content}
            </MarkdownPage>
            <TocContainer />
          </div>
        </div>
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
    console.error(`${error} | with: ${url}`);
    // notFound();
    return <MaxWidthWrapper className=''>404 not found error</MaxWidthWrapper>;
  }
}

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL;

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const url = params.slug.join('/');
  const fileUrl = decodeURIComponent(url); // In real url, it includes escape sequence
  const fileName = fileUrl.split('/').pop() as string; // last element of path : name

  return {
    title: fileName,
    description: `This is the metadata for ${fileUrl}`,
    openGraph: {
      title: fileName,
      description: 'og image description : to be updated',
      url: `${siteUrl}/Study/${url}`,
      siteName: "Yiksan0315's Blog",
      // images: [
      //   {
      //     url: absoluteOgImage,
      //     width: 1200,
      //     height: 630,
      //   },
      // ],
      locale: 'ko_KR',
      type: 'article',
    },
    twitter: {
      card: 'summary_large_image',
      title: fileName,
      description: 'twitter image description : to be updated',
      // images: [absoluteOgImage],
    },
  };
}
