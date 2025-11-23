import blacklist from '@/config/blacklist';
import config from '@/config/revalidate';
import MarkdownFile from '@/types/MarkdownFile';
import path from 'path';
import { cache } from 'react';

export function isMarkdownFile(filePath: string): boolean {
  const ext = path.extname(filePath).toLowerCase();
  return ext === '.md';
}

/**
    get markdown file content.
    @ params filePath: path to markdown file, start with directory name that which makrdown file is in
    */
export const getMdFileContent = cache(async (filePath: string): Promise<string> => {
  const apiUrl = process.env.MARKDOWN_API;
  const token = process.env.API_GITHUB_TOKEN;
  if (!apiUrl || !token) {
    throw new Error('environment is not defined');
  }

  const absUrl = apiUrl + '/' + filePath;
  const response = await fetch(absUrl, {
    headers: {
      Authorization: `Bearer ${token}`,
      Accept: 'application/json',
    },
    next: config.next, // for caching: reavlidate
  });
  // with caching, If same file is requested within revalidate time, it uses cached version.

  if (!response.ok) {
    throw new Error('Failed to fetch markdown file');
  }

  const content = await response.json();
  const text = Buffer.from(content.content, 'base64').toString('utf-8');
  return text;
});

/**
    get directory structure of markdown files, except image file and image file folder named 'attachments'.
    if recursive = true then get all files in the folder.
*/
export const getFolderInfo = cache(
  async (folderPath: string = '', recursive: boolean = false): Promise<MarkdownFile[]> => {
    const apiUrl = process.env.MARKDOWN_API;
    const token = process.env.API_GITHUB_TOKEN;
    if (!apiUrl || !token) {
      throw new Error('environment is not defined');
    }

    const absUrl = apiUrl + '/' + folderPath;
    const response = await fetch(absUrl, {
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: 'application/json',
      },
      next: config.next, // for caching: reavlidate
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch folder info : ${response.statusText}`);
    }

    const contents = await response.json();
    const folderInfo: MarkdownFile[] = await Promise.all(
      contents
        .filter((content: any) => !blacklist.includes(content.name))
        .map(async (content: any) => {
          return {
            name: content.name,
            path: content.path,
            url: '/Study/' + content.path,
            type: content.type,
            children: recursive && content.type === 'dir' ? await getFolderInfo(content.path, true) : undefined,
          };
        })
    );

    return folderInfo;
  }
);
