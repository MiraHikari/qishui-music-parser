import React from 'react';
import { ConfigProvider, theme as antdTheme } from 'antd';
import type { AppProps } from 'next/app';
import '../styles/globals.css'
import '@ant-design/v5-patch-for-react-19';

const App = ({ Component, pageProps }: AppProps) => (
  <ConfigProvider
    theme={{
      token: {
        borderRadius: 12,
      },
      algorithm: antdTheme.darkAlgorithm,
    }}
  >
    <Component {...pageProps} />
  </ConfigProvider>
);

export default App;
