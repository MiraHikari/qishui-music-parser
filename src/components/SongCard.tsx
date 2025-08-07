import React from 'react';
import { Card, Avatar, Typography, Space, Tag, Tooltip, Row, Col, Divider, Button, Tabs, List, Statistic, Descriptions, Badge } from 'antd';
import { AudioOutlined, CopyOutlined, ReloadOutlined } from '@ant-design/icons';
import type { SongInfo, BitRate, Comment } from '../lib/songExtractor';

const { Title, Text } = Typography;
const { TabPane } = Tabs;

export interface SongCardProps {
  song: SongInfo;
  onReload?: () => void;
  onCopy?: (text: string, type: string) => void;
  activeTab: string;
  onTabChange: (key: string) => void;
}

function resolveUrl(url?: string): string | undefined {
  if (!url) return undefined;
  if (/^https?:\/\//i.test(url)) return url;
  if (url.startsWith('//')) return `https:${url}`;
  return `https://${url}`;
}

export default function SongCard({ song, onReload, onCopy, activeTab, onTabChange }: SongCardProps) {
  return (
    <Card
      style={{ borderRadius: 12, margin: '0 auto' }}
      title={
        <div style={{ display: 'flex', alignItems: 'center', margin:'1rem' }}>
          <Avatar src={resolveUrl(song.coverUrl)} shape="square" size={64} style={{ marginRight: 16 }} />
          <div>
            <Space direction="vertical" size={0}>
              <Title level={4} style={{ marginBottom: 0 }}>{song.title}</Title>
              <Text type="secondary">{song.artists?.join(' / ') || ''} {!!song.album && `- ${song.album}`}</Text>
              {song.artistDetails?.length ? (
                <Space wrap size={[6, 6]} style={{ marginTop: 8 }}>
                  {song.artistDetails.map(a => (
                    <span key={a.id} style={{ display: 'inline-flex', alignItems: 'center' }}>
                      <Avatar src={resolveUrl(a.user_info?.thumb_avatar_url?.urls?.[0] || a.user_info?.medium_avatar_url?.urls?.[0] || a.url_avatar?.urls?.[0])} size={24} style={{ marginRight: 6 }} />
                      <Text>{a.name}</Text>
                    </span>
                  ))}
                </Space>
              ) : null}
              {song.contributors && (
                <Space wrap size={[4, 4]}>
                  {song.contributors.lyricists?.length ? (
                    <Tooltip title="作词">
                      <Tag color="blue">作词: {song.contributors.lyricists.join(' / ')}</Tag>
                    </Tooltip>
                  ) : null}
                  {song.contributors.composers?.length ? (
                    <Tooltip title="作曲">
                      <Tag color="geekblue">作曲: {song.contributors.composers.join(' / ')}</Tag>
                    </Tooltip>
                  ) : null}
                </Space>
              )}
            </Space>
          </div>
        </div>
      }
      extra={
        onReload ? (
          <Button icon={<ReloadOutlined />} onClick={() => onReload?.()}>
            重新获取
          </Button>
        ) : null
      }
    >
      <Row gutter={[16, 16]}>
        <Col xs={24} md={10} style={{ textAlign: 'center' }}>
          <Title level={5} style={{ marginBottom: 12 }}>歌曲封面</Title>
          <Avatar src={resolveUrl(song.coverUrl)} shape="square" size={220} style={{ boxShadow: '0 6px 20px rgba(0,0,0,0.25)' }} />
          {song.anchor?.text?.contents?.length ? (
            <div style={{ marginTop: 12 }}>
              <Tag color="purple">{song.anchor.text.contents.join(' ')}</Tag>
            </div>
          ) : null}
        </Col>
        <Col xs={24} md={14}>
          <Title level={5} style={{ textAlign: 'center', marginBottom: 8 }}>歌曲音频</Title>
          <audio controls src={`/api/proxy/audio?url=${encodeURIComponent(song.audioUrl)}`} style={{ width: '100%' }}>
            <AudioOutlined />
            您的浏览器不支持 audio 标签。
          </audio>
          {song.stats ? (
            <div style={{ marginTop: 16 }}>
              <Space size={24} wrap>
                <Statistic title="收藏" value={song.stats.count_collected} />
                <Statistic title="评论" value={song.stats.count_comment} />
                <Statistic title="分享" value={song.stats.count_shared} />
              </Space>
            </div>
          ) : null}
          {song.bitRates?.length ? (
            <div style={{ marginTop: 16 }}>
              <Space wrap>
                {song.bitRates.map((br: BitRate) => (
                  <Tag key={`${br.quality}-${br.br}`} color="geekblue">{br.quality} · {Math.round(br.br / 1000)}kbps</Tag>
                ))}
              </Space>
            </div>
          ) : null}
        </Col>
      </Row>
      <Divider />
      <Tabs activeKey={activeTab} onChange={onTabChange} centered style={{ marginTop: 8 }}>
        <TabPane tab="标准LRC歌词" key="1">
          <Card>
            {(song.contributors?.lyricists?.length || song.contributors?.composers?.length) ? (
              <Space wrap size={[4, 4]} style={{ marginBottom: 8 }}>
                {song.contributors?.lyricists?.length ? (
                  <Tag color="blue">作词: {song.contributors.lyricists.join(' / ')}</Tag>
                ) : null}
                {song.contributors?.composers?.length ? (
                  <Tag color="geekblue">作曲: {song.contributors.composers.join(' / ')}</Tag>
                ) : null}
              </Space>
            ) : null}
            <pre style={{ whiteSpace: 'pre-wrap', fontSize: 13, lineHeight: 1.6, maxHeight: 320, overflowY: 'auto' }}>
              {song.lyrics.lrc}
            </pre>
            <Button icon={<CopyOutlined />} onClick={() => onCopy?.(song.lyrics.lrc, 'LRC歌词')} style={{ marginTop: 8 }}>
              复制LRC
            </Button>
          </Card>
        </TabPane>
        <TabPane tab="逐字歌词" key="2">
          <Card>
            <pre style={{ whiteSpace: 'pre-wrap', fontSize: 13, lineHeight: 1.6, maxHeight: 320, overflowY: 'auto' }}>
              {song.lyrics.wordLrc}
            </pre>
            <Button icon={<CopyOutlined />} onClick={() => onCopy?.(song.lyrics.wordLrc, '逐字歌词')} style={{ marginTop: 8 }}>
              复制逐字歌词
            </Button>
          </Card>
        </TabPane>
        <TabPane tab="歌曲信息" key="3">
          <Card>
            <Descriptions bordered column={1} size="small" labelStyle={{ width: 120 }}>
              <Descriptions.Item label="专辑">{song.albumInfo?.name || song.album}</Descriptions.Item>
              <Descriptions.Item label="演唱者">{song.artists.join(' / ')}</Descriptions.Item>
              <Descriptions.Item label="时长">{Math.round((song.trackInfo?.duration || 0) / 1000)} 秒</Descriptions.Item>
              <Descriptions.Item label="可分享平台">{song.trackInfo?.sharable_platforms?.join('、') || '-'}</Descriptions.Item>
              <Descriptions.Item label="可播放区间">
                {song.trackInfo?.playable_range ? `${song.trackInfo.playable_range.start}s ~ ${song.trackInfo.playable_range.duration}s` : '-'}
              </Descriptions.Item>
            </Descriptions>
            {song.trackInfo?.tags?.length ? (
              <div style={{ marginTop: 12 }}>
                <Space wrap>
                  {song.trackInfo.tags.map((t) => (
                    <Tag key={`${t.category.tag_id}-${t.first_level_tag.tag_id}`}>{t.category.tag_name} / {t.first_level_tag.tag_name}{t.second_level_tag ? ` / ${t.second_level_tag.tag_name}` : ''}</Tag>
                  ))}
                </Space>
              </div>
            ) : null}
          </Card>
        </TabPane>
        {song.labelInfo ? (
          <TabPane tab="音质/权限" key="6">
            <Card>
              <Space direction="vertical" size={12} style={{ width: '100%' }}>
                <Space wrap>
                  <Tag color={song.labelInfo.only_vip_download ? 'red' : 'green'}>
                    仅VIP可下载: {song.labelInfo.only_vip_download ? '是' : '否'}
                  </Tag>
                  {song.labelInfo.quality_only_vip_can_play?.length ? (
                    <>
                      <Text>VIP可播放音质:</Text>
                      {song.labelInfo.quality_only_vip_can_play.map(q => (
                        <Tag key={`p-${q}`} color="gold">{q}</Tag>
                      ))}
                    </>
                  ) : null}
                  {song.labelInfo.quality_only_vip_can_download?.length ? (
                    <>
                      <Text>VIP可下载音质:</Text>
                      {song.labelInfo.quality_only_vip_can_download.map(q => (
                        <Tag key={`d-${q}`} color="purple">{q}</Tag>
                      ))}
                    </>
                  ) : null}
                </Space>
                <Descriptions bordered size="small" column={1} labelStyle={{ width: 160 }}>
                  {Object.entries(song.labelInfo.quality_map || {}).map(([quality, access]) => (
                    <Descriptions.Item key={quality} label={`品质 ${quality}`}>
                      <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
                        <Tag color={access.play_detail.need_vip ? 'red' : 'green'}>
                          播放: {access.play_detail.need_vip ? '需VIP' : '免费'}{access.play_detail.need_purchase ? ' / 需购买' : ''}
                        </Tag>
                        <Tag color={access.download_detail.need_vip ? 'red' : 'green'}>
                          下载: {access.download_detail.need_vip ? '需VIP' : '免费'}{access.download_detail.need_purchase ? ' / 需购买' : ''}
                        </Tag>
                        <Text type="secondary">条件: {access.play_detail.condition || '-'}</Text>
                      </div>
                    </Descriptions.Item>
                  ))}
                </Descriptions>
              </Space>
            </Card>
          </TabPane>
        ) : null}
        {song.comments?.comments?.length ? (
          <TabPane tab={`评论 (${song.comments.count})`} key="4">
            <Card>
              <List
                itemLayout="vertical"
                dataSource={song.comments.comments}
                renderItem={(c: Comment) => (
                  <List.Item key={c.id}
                    extra={<Badge count={c.count_digged} title="点赞" />}
                  >
                    <List.Item.Meta
                      avatar={<Avatar src={resolveUrl(c.user?.thumb_avatar_url?.urls?.[0] || c.user?.medium_avatar_url?.urls?.[0])} />}
                      title={<span>{c.user?.nickname} <Text type="secondary" style={{ marginLeft: 8 }}>{new Date(c.time_created * 1000).toLocaleString()}</Text></span>}
                      description={c.user_artist_info?.user_artist_type ? <Tag color="gold">认证艺术家</Tag> : null}
                    />
                    <div style={{ fontSize: 14, lineHeight: 1.7 }}>{c.content}</div>
                  </List.Item>
                )}
              />
            </Card>
          </TabPane>
        ) : null}
      </Tabs>
    </Card>
  );
}


