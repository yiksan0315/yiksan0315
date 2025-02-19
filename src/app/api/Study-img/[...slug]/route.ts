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
  // 이미지 처리가 문제 ==> 1. 실제로 blob storage를 사용하거나 2. 이미지를 base64로 변환해서 처리하거나 3. 이미지에 대한 api를 아예 따로 만들거나 // 4. 그냥 마찬가지로 github api 받아오면 될 듯?
}

///home/yiksan0315/user/projects/yiksan0315/memo/3. Resource/AI/Deep Learning/Activation Function/attachments/img_ELU-1.png
