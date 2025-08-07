import React from 'react';
import { Steps, Typography, Card } from 'antd';

const { Title, Paragraph, Text } = Typography;

export interface StepsGuideProps {
  current: number;
}

export default function StepsGuide({ current }: StepsGuideProps) {
  return (
    <Card style={{ borderRadius: 12, marginBottom: 16 }}>
      <Title level={4} style={{ marginBottom: 16 }}>使用步骤</Title>
      <Steps
        current={current}
        items={[
          { title: '输入ID', description: '粘贴链接或 ID' },
          { title: '提取数据', description: '后端抓取页面、解析数据' },
          { title: '查看结果', description: '播放音频、复制歌词、查看参与人员' },
        ]}
      />
    </Card>
  );
}


