import MarkdownRender from '@/components/blog/MarkdownRender';
import MaxWidthWrapper from '@/components/MaxWidthWrapper';
import {
  getFileContent,
  getMarkdownFilesRecursively,
} from '@/lib/markdown/getInfoFromGithub';
import MarkdownFile from '@/types/MarkdownFile';

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
      list = list.concat(
        flattenTree({ files: file.subFolder as MarkdownFile[] })
      );
    }
  }
  return list;
}

export async function generateStaticParams() {
  const owner: string = process.env.GITHUB_OWNER as string;
  const repo: string = process.env.GITHUB_REPO as string;

  const files: MarkdownFile[] = await getMarkdownFilesRecursively(
    owner,
    repo,
    '3. Resource'
  );
  const flattenedTree: MarkdownFile[] = flattenTree({ files });

  // 경로를 동적 라우팅에 맞게 변환
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
  const content = await getFileContent(owner, repo, filePath, '3. Resource');
  const fileName = filePath.split('/').pop() ?? '';

  // 마크다운 파일을 HTML로 파싱
  // const htmlContent = await parseMarkdown(content);

  return (
    <MaxWidthWrapper className=''>
      <MarkdownRender fileName={fileName} filePath={filePath}>
        {content}
      </MarkdownRender>
    </MaxWidthWrapper>
  );
}
