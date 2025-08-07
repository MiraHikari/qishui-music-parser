import { useState } from 'react';
import { Card, Spin, message, Row, Col, Typography } from 'antd';
import type { SongInfo } from '../lib/songExtractor';
import dynamic from 'next/dynamic';
import Link from 'next/link';
import Head from 'next/head';

const { Title, Text, Paragraph } = Typography;

export default function Home() {
  const [songId, setSongId] = useState<string>('');
  const [songInfo, setSongInfo] = useState<SongInfo | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<string>('1');
  const [step, setStep] = useState<number>(0);


  const SearchBar = dynamic(() => import('../components/SearchBar'), { ssr: false, loading: () => <div style={{ height: 40 }} /> });
  const SongCard = dynamic(() => import('../components/SongCard'), { ssr: false, loading: () => <Spin /> });
  const StepsGuide = dynamic(() => import('../components/StepsGuide'), { ssr: false, loading: () => <div /> });

  const handleSearch = async (incomingId?: string) => {
    const finalId = (incomingId ?? songId).trim();
    if (!finalId) {
      message.warning('请输入抖音歌曲ID');
      return;
    }
    setLoading(true);
    setError(null);
    setSongInfo(null);
    setStep(1);

    try {
      await handleApiFetch(finalId);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : '发生未知错误';
      setError(`获取歌曲信息失败: ${errorMessage}`);
      message.error(`获取歌曲信息失败: ${errorMessage}`);
    } finally {
      setLoading(false);
    }
  };

  const handleApiFetch = async (id: string) => {
    const response = await fetch(`/api/song/${id}`);
    const result = await response.json();

    if (!response.ok || !result.success) {
      throw new Error(result.error || `请求失败，状态码: ${response.status}`);
    }

    if (!result.data) {
      throw new Error('API返回数据为空');
    }

    setSongInfo(result.data);
    setActiveTab('1');
    setStep(2);
  };

  const copyToClipboard = (text: string, type: string) => {
    navigator.clipboard.writeText(text).then(() => {
      message.success(`${type} 已复制到剪贴板`);
    }, (err) => {
      message.error(`复制失败: ${err}`);
    });
  };

  return (
    <div>
      <Head>
        <title>抖音歌曲信息提取器</title>
      </Head>
      <main className="container mx-auto p-4 sm:p-8 max-w-[1280px]">
        <Card className="mb-6" style={{ borderRadius: 12, marginBottom: 16 }}>
          <Row gutter={[16, 16]} align="middle" justify="space-between">
            <Col xs={24} md={16}>
              <Title level={2} style={{ marginBottom: 4 }}>抖音歌曲信息提取器</Title>
              <Text type="secondary">输入抖音歌曲页面的ID，即可获取歌曲封面、音频和歌词。</Text>
              <Text mark type='secondary'>由于跨域问题，暂时仅能从 API 获取数据。程序 100% 开源可靠。</Text>
            </Col>
            <Col xs={24} md={8}>
              <SearchBar value={songId} onChange={setSongId} onSearch={handleSearch} loading={loading} />
            </Col>
          </Row>
        </Card>

        <StepsGuide current={step} />

        {loading && (
          <div className="text-center">
            <Spin size="large" spinning={true}>
              <div style={{ padding: '50px', textAlign: 'center' }}>
                <Text type="secondary">正在努力提取中...</Text>
              </div>
            </Spin>
          </div>
        )}

        {error && (
          <Card className="mx-auto" style={{ borderColor: '#ffccc7', background: '#fff2f0' }}>
            <div className="text-center" style={{ color: '#cf1322' }}>
              <Title level={4} style={{ color: '#cf1322' }}>出错啦！</Title>
              <Paragraph>{error}</Paragraph>
            </div>
          </Card>
        )}

        {songInfo && (
          <SongCard
            song={songInfo}
            onReload={handleSearch}
            onCopy={copyToClipboard}
            activeTab={activeTab}
            onTabChange={setActiveTab}
          />
        )}

        <Typography
          style={{
            borderTop: '1px solid #f0f0f0',
            paddingTop: '20px',
            margin: 'auto',
            marginTop: '20px',
          }}
        >
          <Text strong>
            Powered by
            {' '}
            <Link href="https://github.com/MiraHikari/qishui-music-parser" target="_blank">
              MiraHikari
            </Link>
            .
            {' '}
            <Text strong style={{ marginLeft: '4px' }}>
              Click
              {' '}
              <Text keyboard>Star</Text>
              {' '}
              to support me.
            </Text>
            <Paragraph
              strong
              style={{
                fontSize: '9px',
                marginTop: 10,
              }}
            >
              <Text mark>
                仅限用于学习和研究目的；不得将上述内容用于商业或者非法用途，否则，一切后果请用户自负。版权争议与本站无关，您必须在下载后的24个小时之内，从您的电脑中彻底删除上述内容。访问和下载本站内容，说明您已同意上述条款。本网站拒绝为违法违规内容服务，请自觉遵守中国大陆相关法律法规。
              </Text>
            </Paragraph>
          </Text>
        </Typography>
      </main>
    </div>
  );
}
