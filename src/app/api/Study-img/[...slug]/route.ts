import PageProps from '@/types/PageProps';
import fs from 'fs/promises';
import { NextRequest, NextResponse } from 'next/server';
import path from 'path';

const mimeTypes: Record<string, string> = {
  png: 'image/png',
  jpg: 'image/jpeg',
  jpeg: 'image/jpeg',
  gif: 'image/gif',
  webp: 'image/webp',
};

export async function GET(request: NextRequest, { params }: PageProps) {
  const mdDir = path.join(process.cwd(), process.env.GITHUB_REPO as string, process.env.MD_STUDY_DIR as string);
  const slugPath = params.slug.join('/');
  const imagePath = path.join(mdDir, slugPath);

  try {
    const imageBuffer = await fs.readFile(imagePath);

    const ext = path.extname(imagePath).toLowerCase().slice(1);

    const headers = new Headers();
    headers.set('Content-Type', mimeTypes[ext] || 'application/octet-stream');

    return new NextResponse(imageBuffer, {
      status: 200,
      headers,
    });
  } catch (error) {
    console.log(`image error: ${error}`);
    return new NextResponse(null, { status: 404 });
  }
}

///home/yiksan0315/user/projects/yiksan0315/memo/3. Resource/AI/Deep Learning/Activation Function/attachments/img_ELU-1.png
