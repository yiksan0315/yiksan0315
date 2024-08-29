import MarkdownFile from '@/types/MarkdownFile';

export async function getMarkdownFilesRecursively(
  owner: string,
  repo: string,
  path: string = ''
): Promise<MarkdownFile[]> {
  const root = '3. Resource';
  const replacePath = 'blog';

  const response = await fetch(
    `https://api.github.com/repos/${owner}/${repo}/contents/${path}`,
    {
      headers: {
        Authorization: `Bearer ${process.env.GITHUB_TOKEN}`,
        Accept: 'application/vnd.github.v3+json',
        'Cache-Control': 'no-cache',
      },
    }
  );

  if (!response.ok) {
    throw new Error(`Error fetching file list: ${response.statusText}`);
  }

  const res: MarkdownFile[] = await response.json();
  let dataLists: MarkdownFile[] = [];

  for (const item of res) {
    if (item.type === 'file' /* && item.name.endsWith('.md')*/) {
      dataLists.push({
        name: item.name,
        path: item.path,
        url: item.path.replace(root, replacePath),
        type: 'file',
      });
    } else if (item.type === 'dir') {
      const subFolderFiles = await getMarkdownFilesRecursively(
        owner,
        repo,
        item.path
      );
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

export async function getFileContent(
  owner: string,
  repo: string,
  path: string,
  from: string = '3. Resource'
): Promise<string> {
  const response = await fetch(
    `https://api.github.com/repos/${owner}/${repo}/contents/${from}/${path}`,
    {
      headers: {
        Authorization: `Bearer ${process.env.GITHUB_TOKEN}`,
        Accept: 'application/vnd.github.v3.raw',
        'Cache-Control': 'no-cache',
      },
    }
  );

  if (!response.ok) {
    throw new Error(`Error fetching file content: ${response.statusText}`);
  }

  const content = await response.text();
  return content;
}
