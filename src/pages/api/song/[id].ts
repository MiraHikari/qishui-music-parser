import type { NextApiRequest, NextApiResponse } from 'next';
import {
  SongInfo,
  extractInlineDataFromHtml,
  constructSongInfoFromInlineData,
} from '../../../lib/songExtractor';

// 简化API响应结构
type ApiResponse = {
  success: boolean;
  data?: SongInfo;
  error?: string;
  message?: string;
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ApiResponse>
) {
  if (req.method !== 'GET') {
    res.setHeader('Allow', 'GET');
    return res.status(405).json({
      success: false,
      error: 'Method Not Allowed'
    });
  }

  const { id } = req.query;

  if (typeof id !== 'string' || !id) {
    return res.status(400).json({
      success: false,
      error: 'Song ID is required'
    });
  }

  const url = `https://www.douyin.com/qishui/song/${id}`;

  try {
    console.log(`Fetching URL: ${url}`);
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

    if (!response.ok) {
      throw new Error(`请求失败，状态码: ${response.status}`);
    }

    const htmlContent = await response.text();
    console.log(`Successfully fetched from: ${url}`);

    // 提取歌曲信息
    const { parsedData } = extractInlineDataFromHtml(htmlContent, {
      expectedLoaderKey: 'song_(id)/page',
    });

    const songInfo = constructSongInfoFromInlineData(parsedData, {
      expectedLoaderKey: 'song_(id)/page',
    });

    if (songInfo) {
      res.status(200).json({
        success: true,
        data: songInfo,
      });
    } else {
      res.status(404).json({
        success: false,
      });
    }
  } catch (error) {
    console.error(`Error processing song ID ${id}:`, error);
    const errorMessage = error instanceof Error ? error.message : '发生未知错误';
    res.status(500).json({
      success: false,
      error: `${errorMessage}`
    });
  }
}
