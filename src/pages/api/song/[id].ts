// src/pages/api/song/[id].ts

import type { NextApiRequest, NextApiResponse } from 'next';
import {
  SongInfo,
  extractInlineDataFromHtml,
  constructSongInfoFromInlineData,
  toJsModule,
  type ExtractionDebugInfo,
} from '../../../lib/songExtractor';

// 定义API响应的数据结构
type JsonOk = {
  song: SongInfo | null;
  parsedData?: any;
  jsonText?: string | null;
  debug?: ExtractionDebugInfo;
  from?: 'douyin';
  source?: string;
};

type Data = SongInfo | JsonOk | { error: string } | string;

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  if (req.method !== 'GET') {
    res.setHeader('Allow', 'GET');
    return res.status(405).json({ error: 'Method Not Allowed' });
  }
  // 从URL中获取动态参数 [id]
  const { id } = req.query;

  // 控制选项
  const debugEnabled = req.query.debug === '1' || req.query.debug === 'true';
  const format = (req.query.format as string) || 'json'; // 'json' | 'js'
  const variableName = (req.query.var as string) || 'song';

  if (typeof id !== 'string' || !id) {
    return res.status(400).json({ error: 'Song ID is required.' });
  }

  // 尝试不同的URL格式（当没有提供自定义 url / file / html 时使用）
  const possibleUrls = [
    `https://www.douyin.com/qishui/song/${id}`,
  ];

  try {
    let htmlContent = '';
    let successUrl = '';
    // 仅从抖音页面获取HTML（带有 inline data）
    for (const url of possibleUrls) {
      try {
        console.log(`Trying URL: ${url}`);
        const response = await fetch(url, {
          headers: {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
            'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
            'Accept-Language': 'zh-CN,zh;q=0.9,en;q=0.8',
            'Accept-Encoding': 'gzip, deflate, br',
            DNT: '1',
            Connection: 'keep-alive',
            'Upgrade-Insecure-Requests': '1',
          },
        });
        if (response.ok) {
          htmlContent = await response.text();
          successUrl = url;
          console.log(`Successfully fetched from: ${url}`);
          break;
        } else {
          console.log(`Failed to fetch from ${url}, status: ${response.status}`);
        }
      } catch (fetchError) {
        console.log(`Error fetching from ${url}:`, fetchError);
        continue;
      }
    }

    if (!htmlContent) {
      throw new Error(`Failed to fetch the page from any of the attempted URLs. The song ID ${id} may not exist or the URL format has changed.`);
    }

    // 2. 提取 inline 数据与 SongInfo
    const { parsedData, jsonText, debug } = extractInlineDataFromHtml(htmlContent, {
      debug: debugEnabled,
      expectedLoaderKey: 'song_(id)/page',
    });
    const songInfo = constructSongInfoFromInlineData(parsedData, {
      expectedLoaderKey: 'song_(id)/page',
    });

    // 3. 输出
    if (format === 'js') {
      if (!songInfo) {
        return res.status(404).json({ error: 'Could not extract song information for JS output.' });
      }
      const moduleText = toJsModule(songInfo, variableName);
      res.setHeader('Content-Type', 'application/javascript; charset=utf-8');
      res.status(200).send(moduleText);
      return;
    }

    // 默认维持向后兼容：未开启 debug 时直接返回 SongInfo
    if (!debugEnabled) {
      if (songInfo) {
        res.status(200).json(songInfo);
      } else {
        res.status(404).json({ error: 'Could not extract song information. The song may not exist or the page structure has changed.' });
      }
      return;
    }

    // debug=1 时返回扩展信息
    const payload: JsonOk = {
      song: songInfo || null,
      parsedData: parsedData,
      jsonText: jsonText ?? null,
      debug: debug,
      from: 'douyin',
      source: successUrl || undefined,
    };
    res.status(songInfo ? 200 : 404).json(payload);
  } catch (error) {
    console.error(`Error processing song ID ${id}:`, error);
    const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred.';
    res.status(500).json({ error: `An internal server error occurred: ${errorMessage}` });
  }
}
