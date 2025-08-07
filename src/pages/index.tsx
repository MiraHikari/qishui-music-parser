// src/pages/index.tsx

import { useState, Suspense } from 'react';
import { Input, Button, Card, Spin, message, Row, Col, Typography, Avatar, Tabs, Tag, Space, Divider, Tooltip } from 'antd';
import { SearchOutlined, AudioOutlined, CopyOutlined, ReloadOutlined } from '@ant-design/icons';
import type { SongInfo } from '../lib/songExtractor'; // 引入类型
import dynamic from 'next/dynamic';

const { Title, Text, Paragraph } = Typography;
const { TabPane } = Tabs;

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
      const response = await fetch(`/api/song/${finalId}`);
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || `请求失败，状态码: ${response.status}`);
      }
      const data: SongInfo = await response.json();
      setSongInfo(data);
      setActiveTab('1');
      setStep(2);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : '发生未知错误';
      setError(`获取歌曲信息失败: ${errorMessage}`);
      message.error(`获取歌曲信息失败: ${errorMessage}`);
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = (text: string, type: string) => {
    navigator.clipboard.writeText(text).then(() => {
      message.success(`${type} 已复制到剪贴板`);
    }, (err) => {
      message.error(`复制失败: ${err}`);
    });
  };

  return (
    <main className="container mx-auto p-4 sm:p-8" style={{ maxWidth: 1200 }}>
      <Card className="mb-6" style={{ borderRadius: 12, marginBottom: 16 }}>
        <Row gutter={[16, 16]} align="middle" justify="space-between">
          <Col xs={24} md={16}>
            <Title level={2} style={{ marginBottom: 4 }}>抖音歌曲信息提取器</Title>
            <Text type="secondary">输入抖音歌曲页面的ID，即可获取歌曲封面、音频和歌词。</Text>
          </Col>
          <Col xs={24} md={8}>
            <SearchBar value={songId} onChange={setSongId} onSearch={handleSearch} loading={loading} />
          </Col>
        </Row>
      </Card>

      <StepsGuide current={step} />

      {loading && (
        <div className="text-center">
          <Spin size="large" tip="正在努力提取中..." />
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
    </main>

  );
}
