import { Webhooks } from '@octokit/webhooks';
import extract from 'extract-zip';
import fs from 'fs';
import { revalidatePath } from 'next/cache';
import { NextRequest, NextResponse } from 'next/server';
import path from 'path';
import { pipeline } from 'stream';
import { promisify } from 'util';

const streamPipeline = promisify(pipeline);

class StatusError extends Error {
  constructor(public readonly status: number, message: string) {
    super(message);
    this.name = 'Status Error';
  }
}

export async function POST(req: NextRequest): Promise<NextResponse> {
  const isDevelopment = process.env.NODE_ENV === 'development';

  try {
    if (!isDevelopment) {
      console.log('0. Checking signature');
      const secret = process.env.GITHUB_WEBHOOK_SECRET;
      const signature = req.headers.get('x-hub-signature-256');
      const rawBody = await req.text();

      if (!secret) {
        throw new StatusError(500, 'No secret set.');
      }
      if (!signature) {
        throw new StatusError(400, 'No signature.');
      }
      if (!rawBody) {
        throw new StatusError(400, 'No rawBody.');
      }

      if (!(await new Webhooks({ secret }).verify(rawBody, signature))) {
        throw new StatusError(400, 'Fail signature verify');
      }
    }

    const token = process.env.GITHUB_TOKEN;
    const username = process.env.GITHUB_OWNER;
    const reponame = process.env.GITHUB_REPO;
    if (!token || !username || !reponame) {
      throw new Error('Environment variables not set');
    }

    const url = `https://api.github.com/repos/${username}/${reponame}/zipball/master`;
    const response = await fetch(url, {
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: 'application/vnd.github.v3+json',
      },
      redirect: 'manual', // Prevents the browser from following the redirect
    });

    const donwloadUrl = response.headers.get('Location');
    if (response.status !== 302 || donwloadUrl === null) {
      // 302 : Found
      throw new StatusError(response.status, `Failed to fetch zipball: ${response.statusText}`);
    }

    const zipball = await fetch(donwloadUrl);
    if (!zipball.ok || !zipball.body) {
      throw new StatusError(response.status, `Failed to fetch zipball: ${response.statusText}`);
    }

    const filePath = path.join(process.cwd(), `${reponame}.zip`);
    const fileStream = fs.createWriteStream(filePath);

    // pipe zipball to file, save it.
    await streamPipeline(zipball.body as any, fileStream);
    console.log('1. Downloaded zipball');

    const repoPath = path.join(process.cwd(), reponame);
    if (fs.existsSync(repoPath)) {
      await fs.promises.rmdir(repoPath, { recursive: true });
      console.log('\t1.1 Removed old repo');
    }

    // unzip file
    await extract(filePath, { dir: process.cwd() });
    console.log('2. unzip file');

    const name = (await fs.promises.readdir(process.cwd())).filter((name) =>
      name.startsWith(`${username}-${reponame}`)
    )[0];

    // rename folder
    await fs.promises.rename(path.join(process.cwd(), name), repoPath);
    console.log('3. Renamed folder');

    // remove zip file
    await fs.promises.unlink(filePath);
    console.log('4. removed zip file');

    revalidatePath('/Study', 'page');

    return NextResponse.json({ message: 'Rebuilding site...' }, { status: zipball.status });
  } catch (error) {
    if (error instanceof StatusError) {
      return NextResponse.json({ error: error.message }, { status: error.status });
    }
    return NextResponse.json({ error: `Internal Server Error: ${error}` }, { status: 500 });
  }
}
