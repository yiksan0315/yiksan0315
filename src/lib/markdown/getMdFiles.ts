import MarkdownFile from '@/types/MarkdownFile';
import fs from 'fs';
import path from 'path';

function isMarkdownFile(filePath: string): boolean {
  const ext = path.extname(filePath).toLowerCase();
  return ext === '.md';
}

const mdDir = path.join(process.cwd(), process.env.GITHUB_REPO as string);

export async function getDirectoryStructure(objPath: string): Promise<MarkdownFile[]> {
  /**
    @ params objPath: path to object directory that you want to get the structure, except path to MD directory
   */

  const dirStruct: MarkdownFile[] = [];
  const AbsPath = path.join(mdDir, objPath); // Absolute path to object directory in system
  const items = fs.readdirSync(AbsPath);

  for (const item of items) {
    // item: file or directory name
    // itemPath: releative path to item, from mdDir
    const itemPath = path.join(objPath, item);

    const stat = fs.statSync(path.join(AbsPath, item));

    if (stat.isDirectory()) {
      dirStruct.push({
        name: item,
        type: 'dir',
        path: itemPath,
        children: await getDirectoryStructure(itemPath),
      });
    } else if (isMarkdownFile(item)) {
      dirStruct.push({
        name: item,
        type: 'mdFile',
        path: itemPath,
      });
    } else {
      dirStruct.push({
        name: item,
        type: 'image',
        path: itemPath,
      });
    }
  }

  return dirStruct;
}

export async function getFileContent(objPath: string): Promise<string | string[]> {
  const absPath = path.join(mdDir, objPath);
  const stats = fs.statSync(absPath);
  if (stats.isDirectory()) {
    return fs.readdirSync(absPath);
  } else {
    const content = fs.readFileSync(absPath, 'utf-8');
    return content;
  }
}
