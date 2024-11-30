import MarkdownRender from '@/components/blog/MarkdownRender';
import MaxWidthWrapper from '@/components/MaxWidthWrapper';
import { getFileContent, getMarkdownFilesRecursively } from '@/lib/markdown/getInfoFromGithub';
import MarkdownFile from '@/types/MarkdownFile';
import Link from 'next/link';
import { notFound } from 'next/navigation';

interface MarkdownPageProps {
  params: {
    slug: string[];
  };
}

function flattenTree({ files }: { files: MarkdownFile[] }): MarkdownFile[] {
  let list: MarkdownFile[] = [];
  for (const file of files) {
    if (file.type === 'file') {
      list.push(file);
    } else if (file.type === 'dir') {
      /**
       * if file.type === 'dir' then file.subFolder is not undefined
       */
      list = list.concat(flattenTree({ files: file.subFolder as MarkdownFile[] }));
    }
  }
  return list;
}

export async function generateStaticParams() {
  const owner: string = process.env.GITHUB_OWNER as string;
  const repo: string = process.env.GITHUB_REPO as string;

  const files: MarkdownFile[] = await getMarkdownFilesRecursively(owner, repo, '3. Resource');
  const flattenedTree: MarkdownFile[] = flattenTree({ files });
  return flattenedTree.map((item: MarkdownFile) => {
    return {
      slug: item.path.replace('3. Resource/', '').split('/'),
    };
  });
}

export default async function MarkdownPage({ params }: MarkdownPageProps) {
  const owner: string = process.env.GITHUB_OWNER as string;
  const repo: string = process.env.GITHUB_REPO as string;

  // 경로를 이용하여 파일의 실제 경로 생성
  const filePath = params.slug.join('/');
  const fileName = filePath.split('/').pop() ?? '';

  try {
    const response = await getFileContent(owner, repo, filePath, '3. Resource');

    if (fileName.endsWith('.md')) {
      const content = await response.text();
      return (
        <MaxWidthWrapper className=''>
          <MarkdownRender fileName={fileName} filePath={filePath}>
            {content}
          </MarkdownRender>
        </MaxWidthWrapper>
      );
    } else if (fileName.endsWith('.png')) {
      console.log('png file not implemented');
    } else {
      const content: MarkdownFile[] = await response.json();
      return (
        <MaxWidthWrapper className=''>
          {content.map((item) => {
            return (
              <div key={item.path}>
                <Link href={'/' + item.path.replace('3. Resource', 'blog')}>{`${item.name} : ${item.type}`}</Link>
              </div>
            );
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
