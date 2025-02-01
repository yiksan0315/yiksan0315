import { exec } from 'child_process';
import fs from 'fs';
import { NextRequest, NextResponse } from 'next/server';
import path from 'path';

export async function POST(req: NextRequest): Promise<NextResponse> {
  const token = process.env.GITHUB_TOKEN;
  const secret = process.env.GITHUB_WEBHOOK_SECRET;
  const username = process.env.GITHUB_OWNER;
  const markdownRepoUrl = `https://${username}:${token}@${process.env.GITHUB_MD_REPO}`;

  const markdownDir = path.join(process.cwd(), 'memo');

  if (!secret) {
    return NextResponse.json({ error: 'Webhook secret not set' }, { status: 500 });
  }

  try {
    /** Check modeified files : only markdown or images(png) */
    /**

    const body = await req.json();

    const extensions = ['.md', '.png'];
    const modifiedFiles: string[] = body.commits.flatMap((commit: any) => commit.modified || []);
    if (!modifiedFiles.some((file) => extensions.some((ext) => file.endsWith(ext)))) {
      return NextResponse.json({ message: 'No Markdown changes detected' });
    }
    */

    if (!fs.existsSync(markdownDir)) {
      console.log('Markdown repository not found locally. Cloning...');
      exec(`git clone ${markdownRepoUrl} ${markdownDir}`, (error, stdout, stderr) => {
        if (error) {
          console.error(`Git clone error: ${error.message}`);
          return;
        }
        console.log('Markdown repository cloned successfully.');
      });
    } else {
      console.log('Markdown repository already exists. Pulling latest changes...');
      exec(`cd ${markdownDir} && git pull`, (error, stdout, stderr) => {
        if (error) {
          console.error(`Git pull error in markdown repo: ${error.message}`);
          return;
        }
        console.log('Markdown repository updated.');
      });
    }

    return NextResponse.json({ message: 'Rebuilding site...' });
  } catch (error) {
    console.error('Webhook Error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
