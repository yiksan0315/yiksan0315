import StatusError from '@/lib/api/statusError';
import PageProps from '@/types/PageProps';
import { NextRequest, NextResponse } from 'next/server';

const mimeTypes: Record<string, string> = {
  png: 'image/png',
  jpg: 'image/jpeg',
  jpeg: 'image/jpeg',
  gif: 'image/gif',
  webp: 'image/webp',
};

export async function GET(request: NextRequest, { params }: PageProps) {
  const apiUrl = process.env.MARKDOWN_API;
  const token = process.env.GITHUB_TOKEN;

  try {
    if (!apiUrl || !token) {
      throw new StatusError(500, 'environment is not defined');
    }

    const slugPath = params.slug.join('/');
    const absUrl = apiUrl + '/' + slugPath;
    const metadataResponse = await fetch(absUrl, {
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: 'application/vnd.github.v3+json',
      },
    });

    if (!metadataResponse.ok) {
      throw new StatusError(metadataResponse.status, 'Failed to fetch image metadata.');
    }

    const metadata = await metadataResponse.json();

    if (!metadata.download_url) {
      throw new StatusError(404, 'Image download URL not found.');
    }

    const imageResponse = await fetch(metadata.download_url);
    if (!imageResponse.ok) {
      throw new StatusError(imageResponse.status, 'Failed to fetch image.');
    }

    const imageBuffer = await imageResponse.arrayBuffer();

    return new Response(imageBuffer, {
      headers: {
        'Content-Type': metadata.type || 'image/png',
        'Content-Length': imageBuffer.byteLength.toString(),
        'Cache-Control': 'public, max-age=3600',
      },
    });
  } catch (error) {
    if (error instanceof StatusError) {
      return NextResponse.json({ error: error.message }, { status: error.status });
    }
    return NextResponse.json({ error: `Internal Server Error: ${error}` }, { status: 500 });
  }
}
