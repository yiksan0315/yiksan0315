import MarkdownFile from '@/types/MarkdownFile';

export async function getMarkdownFilesRecursively(
  owner: string,
  repo: string,
  path: string = ''
): Promise<MarkdownFile[]> {
  const root = '3. Resource';
  const replacePath = 'blog';

  const response = await fetch(`https://api.github.com/repos/${owner}/${repo}/contents/${path}?t=${Date.now()}`, {
    headers: {
      Authorization: `Bearer ${process.env.GITHUB_TOKEN}`,
      Accept: 'application/vnd.github.v3+json',
      // 'Cache-Control': 'no-cache',
      'User-Agent': 'request',
    },
  });

  if (!response.ok) {
    throw new Error(`Error while fetching file list: ${response.statusText} and ${response.status}`);
  }

  const res: MarkdownFile[] = await response.json();
  let dataLists: MarkdownFile[] = [];

  for (const item of res) {
    const ext = item.name.split('.').pop() as string;

    if (item.type === 'file' && item.name.endsWith('.md')) {
      dataLists.push({
        name: item.name,
        path: item.path,
        url: item.path.replace(root, replacePath),
        type: 'file',
      });
    } else if (item.type === 'dir' && item.name !== 'attachments') {
      const subFolderFiles = await getMarkdownFilesRecursively(owner, repo, item.path);
      dataLists.push({
        name: item.name,
        path: item.path,
        url: item.path.replace(root, replacePath),
        type: 'dir',
        subFolder: subFolderFiles,
      });
    }
  }

  return dataLists;
}

export async function getFileContent(owner: string, repo: string, path: string, root?: string): Promise<Response> {
  const response = await fetch(
    `https://api.github.com/repos/${owner}/${repo}/contents/${root !== undefined ? root + '/' : ''}${path}`,
    {
      headers: {
        Authorization: `Bearer ${process.env.GITHUB_TOKEN}`,
        Accept: 'application/vnd.github.v3.raw',
        // 'Cache-Control': 'no-cache',
        'User-Agent': 'request',
      },
    }
  );

  if (!response.ok) {
    throw new Error(`Error fetching file content: ${response.statusText}`);
  }

  return response;
}

import fs from 'fs';
import path from 'path';

const markdownDir = path.join(process.cwd(), 'markdown'); // 마크다운 파일 디렉토리

export function getMarkdownFiles() {
  const files = fs.readdirSync(markdownDir);

  return files
    .filter((file) => file.endsWith('.md'))
    .map((file) => {
      const filePath = path.join(markdownDir, file);
      const content = fs.readFileSync(filePath, 'utf-8');
      return {
        filename: file,
        content,
      };
    });
}
