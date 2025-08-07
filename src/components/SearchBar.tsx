import { Input, Button, Form } from 'antd';
import { SearchOutlined } from '@ant-design/icons';
import React, { useEffect } from 'react';

export interface SearchBarProps {
  value: string;
  onChange: (value: string) => void;
  onSearch: (id: string) => void;
  loading?: boolean;
  placeholder?: string;
}

export default function SearchBar({ value, onChange, onSearch, loading, placeholder }: SearchBarProps) {
  const [form] = Form.useForm();

  // keep external value synced into form
  useEffect(() => {
    form.setFieldsValue({ id: value });
  }, [value, form]);

  const extractId = (input: string): string => {
    if (!input) return '';
    // match Douyin song URL or just digits
    const urlMatch = input.match(/douyin\.com\/qishui\/song\/([0-9]+)/i);
    if (urlMatch) return urlMatch[1];
    const idMatch = input.match(/^[0-9]+$/);
    return idMatch ? idMatch[0] : input;
  };

  const handleFinish = async () => {
    const raw = form.getFieldValue('id') as string;
    const id = extractId(raw);
    if (id !== raw) {
      form.setFieldsValue({ id });
    }
    onChange(id);
    onSearch(id);
  };

  return (
    <Form form={form} onFinish={handleFinish} layout="inline" style={{ width: '100%' }}>
      <Form.Item
        name="id"
        style={{ flex: 1, marginRight: 8, marginBottom: 0, width: '100%' }}
        rules={[
          {
            required: true,
            message: '请输入歌曲ID或粘贴完整链接',
          },
          {
            validator: async (_, val: string) => {
              if (!val) return Promise.reject();
              const id = extractId(val);
              // auto-normalize to id for convenience
              if (id !== val) form.setFieldsValue({ id });
              // validate that the result is numeric
              if (!/^[0-9]+$/.test(id)) {
                return Promise.reject('请输入正确的ID或有效链接');
              }
              return Promise.resolve();
            },
          },
        ]}
      >
        <Input
          allowClear
          size="large"
          placeholder={
            placeholder || '例如: https://www.douyin.com/qishui/song/7531954496243927057 或 7531954496243927057'
          }
          onChange={(e) => form.setFieldsValue({ id: e.target.value })}
          onPressEnter={() => form.submit()}
        />
      </Form.Item>
      <Form.Item style={{ marginBottom: 0 }}>
        <Button
          htmlType="submit"
          type="primary"
          size="large"
          icon={<SearchOutlined />}
          loading={loading}
        >
          提取
        </Button>
      </Form.Item>
    </Form>
  );
}


