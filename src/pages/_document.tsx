import React from 'react';
import { createCache, extractStyle, StyleProvider } from '@ant-design/cssinjs';
import Document, { Head, Html, Main, NextScript } from 'next/document';
import type { DocumentContext } from 'next/document';

const MyDocument = () => (
  <Html lang="zh-CN">
    <Head>
      <meta charSet="utf-8" />
      <meta name="viewport" content="width=device-width, initial-scale=1" />
      <meta name="referrer" content="no-referrer" />

      {/* 基本SEO信息 */}
      <meta name="description" content="抖音歌曲信息提取器 - 快速获取抖音歌曲的封面、音频、歌词等详细信息，支持LRC格式和逐字歌词" />
      <meta name="keywords" content="抖音,歌曲提取,音乐下载,歌词提取,LRC歌词,抖音音乐,歌曲信息" />
      <meta name="author" content="抖音歌曲信息提取器" />

      {/* Open Graph / Facebook */}
      <meta property="og:type" content="website" />
      <meta property="og:title" content="抖音歌曲信息提取器" />
      <meta property="og:description" content="快速获取抖音歌曲的封面、音频、歌词等详细信息，支持LRC格式和逐字歌词" />
      <meta property="og:site_name" content="抖音歌曲信息提取器" />

      {/* Twitter */}
      <meta property="twitter:card" content="summary_large_image" />
      <meta property="twitter:title" content="抖音歌曲信息提取器" />
      <meta property="twitter:description" content="快速获取抖音歌曲的封面、音频、歌词等详细信息，支持LRC格式和逐字歌词" />

      {/* 其他元数据 */}
      <meta name="robots" content="index, follow" />
      <meta name="theme-color" content="#1890ff" />
    </Head>
    <body>
      <Main />
      <NextScript />
    </body>
  </Html>
);

MyDocument.getInitialProps = async (ctx: DocumentContext) => {
  const cache = createCache();
  const originalRenderPage = ctx.renderPage;
  ctx.renderPage = () =>
    originalRenderPage({
      enhanceApp: (App) => (props) => (
        <StyleProvider cache={cache}>
          <App {...props} />
        </StyleProvider>
      ),
    });

  const initialProps = await Document.getInitialProps(ctx);
  const style = extractStyle(cache, true);
  return {
    ...initialProps,
    styles: (
      <>
        {initialProps.styles}
        <style dangerouslySetInnerHTML={{ __html: style }} />
      </>
    ),
  };
};

export default MyDocument;
