import {
  getFileContent,
  getMarkdownFilesRecursively,
} from '@/lib/markdown/getInfoFromGithub';
import parseMarkdown from '@/lib/markdown/parseMarkdown';
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
  const owner: string = process.env.GITHUB_OWNER ?? '';
  const repo: string = process.env.GITHUB_REPO ?? '';

  const files: MarkdownFile[] = await getMarkdownFilesRecursively(
    owner,
    repo,
    '3. Resource'
  );
  const flattenedTree: MarkdownFile[] = flattenTree({ files });

  // 경로를 동적 라우팅에 맞게 변환
  return flattenedTree.map((item: MarkdownFile) => ({
    slug: item.path.replace(/\.md$/, '').split('/'), // .md 확장자 제거 후 슬래시로 구분
  }));
}

export default async function MarkdownPage({ params }: MarkdownPageProps) {
  const owner: string = process.env.GITHUB_OWNER ?? '';
  const repo: string = process.env.GITHUB_REPO ?? '';

  // 경로를 이용하여 파일의 실제 경로 생성
  const filePath = params.slug.join('/');
  console.log(params.slug);

  console.log(filePath);
  // 파일 내용 가져오기
  const content = await getFileContent(owner, repo, filePath);

  // 마크다운 파일을 HTML로 파싱
  const htmlContent = await parseMarkdown(content);

  return (
    <div>
      <h1>{filePath}</h1> {/* 파일 경로를 제목으로 표시 */}
      <div dangerouslySetInnerHTML={{ __html: htmlContent }} />
    </div>
  );
}
