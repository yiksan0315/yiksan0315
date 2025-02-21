import StatusError from '@/lib/api/statusError';
import { revalidatePath } from 'next/cache';
import { NextRequest, NextResponse } from 'next/server';
import { Webhooks } from '@octokit/webhooks';

const webhooks = new Webhooks({
  secret: process.env.GITHUB_WEBHOOK_SECRET as string,
});

export async function POST(req: NextRequest): Promise<NextResponse> {
  const isDevelopment = process.env.NODE_ENV === 'development';

  try {
    if (!isDevelopment) {
      console.log('Checking signature...');
      const signature = req.headers.get('x-hub-signature-256');
      const body = await req.text();

      if (!process.env.GITHUB_WEBHOOK_SECRET) {
        throw new StatusError(500, 'No secret.');
      }

      if (!signature) {
        throw new StatusError(400, 'No signature.');
      }

      if (!(await webhooks.verify(body, signature))) {
        throw new StatusError(400, 'Invalid signature.');
      }
    }

    revalidatePath('/Study', 'page');

    return NextResponse.json({ message: 'Rebuilding site...' }, { status: 200 });
  } catch (error) {
    if (error instanceof StatusError) {
      return NextResponse.json({ error: error.message }, { status: error.status });
    }
    return NextResponse.json({ error: `Internal Server Error: ${error}` }, { status: 500 });
  }
}
