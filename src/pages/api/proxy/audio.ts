import type { NextApiRequest, NextApiResponse } from 'next';
import { Readable } from 'stream';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    res.setHeader('Allow', 'GET');
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  const url = req.query.url as string;
  if (!url || !/^https?:\/\//i.test(url)) {
    return res.status(400).json({ error: 'Invalid url' });
  }

  try {
    const range = req.headers.range as string | undefined;
    const headers: Record<string, string> = {
      'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
      Accept: '*/*',
      Connection: 'keep-alive',
      Referer: 'https://www.douyin.com/',
    };
    if (range) headers.range = range;

    const upstream = await fetch(url, { headers });
    const status = upstream.status;

    // Pass through relevant headers
    upstream.headers.forEach((value, key) => {
      const k = key.toLowerCase();
      if (
        k === 'content-type' ||
        k === 'content-length' ||
        k === 'accept-ranges' ||
        k === 'content-range' ||
        k === 'etag' ||
        k === 'last-modified' ||
        k === 'cache-control'
      ) {
        res.setHeader(key, value);
      }
    });

    // Allow CORS in case it's used cross-origin
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, HEAD, OPTIONS');

    res.status(status);
    if (upstream.body) {
      // Convert Web stream to Node stream and pipe; in some TS setups ReadableStream types differ, so cast to any
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const webBody: any = upstream.body as any;
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const nodeStream = (Readable as any).fromWeb ? (Readable as any).fromWeb(webBody) : Readable.from(webBody);
      nodeStream.pipe(res);
      return;
    }

    res.end();
  } catch (error) {
    console.error('Proxy error:', error);
    res.status(500).json({ error: 'Proxy failed' });
  }
}


