import StatusError from '@/lib/api/statusError';
import { revalidatePath } from 'next/cache';
import { NextRequest, NextResponse } from 'next/server';

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

      // if (!(await new Webhooks({ secret }).verify(rawBody, signature))) {
      //   throw new StatusError(400, 'Fail signature verify');
      // }
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
