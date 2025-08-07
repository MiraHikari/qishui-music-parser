# 某音汽水歌曲信息提取器

一个工具，可以提取某音歌曲的详细信息，包括封面、音频、LRC歌词、逐字歌词以及其他元数据。

## ✨ 功能特性

- **歌曲信息提取**：输入某音歌曲的链接或ID，即可获取完整的歌曲信息
- **丰富的元数据**：除了基本信息，还可获取作词、作曲、音质、评论、相关歌曲等
- **多种歌词格式**：提供标准LRC歌词和逐字歌词（Enhanced LRC）

## 🚀 快速开始

1.  **安装依赖**

    ```bash
    pnpm install
    ```

2.  **启动开发服务器**

    ```bash
    pnpm dev
    ```

3.  **打开浏览器**

    访问 [http://localhost:3000](http://localhost:3000) 查看效果。

## 🛠️ 技术栈

- **前端框架**: [Next.js](https://nextjs.org/) (React)
- **UI 组件库**: [Ant Design](https://ant.design/)
- **样式**: [Tailwind CSS](https://tailwindcss.com/)
- **语言**: [TypeScript](https://www.typescriptlang.org/)

## 📝 API 使用


### 端点信息

- **URL**: `/api/song/[id]`
- **方法**: `GET`
- **参数**:
  - `id` (必需): 某音歌曲的ID

### 响应格式

```json
{
  "success": true,
  "data": {
    "id": "7531954496243927057",
    "title": "歌曲标题",
    "artists": ["艺术家"],
    "coverUrl": "封面图片URL",
    "audioUrl": "音频文件URL",
    "lyrics": ....,
    // ... 其他歌曲信息
  },
  "error": null,
}
```

### 使用示例

```bash
# 获取歌曲信息
curl http://localhost:3000/api/song/7531954496243927057
```

```javascript
// JavaScript 调用示例
fetch('/api/song/7531954496243927057')
  .then(response => response.json())
  .then(data => {
    if (data.success) {
      console.log('歌曲信息:', data.data);
    } else {
      console.error('获取失败:', data.message);
    }
  });
```

## 🎵 使用说明

### 如何获取歌曲ID

1. 打开某音
2. 找到想要提取的歌曲页面
3. 复制链接，ID通常是链接中的数字部分
4. 例如：`https://www.dyxxxx.com/qishui/song/7531954496243927057` 中的 `7531954496243927057`

### 功能说明

- **歌曲信息展示**：显示歌曲标题、艺术家、封面等基本信息
- **音频播放**：支持在线播放歌曲音频
- **歌词显示**：提供LRC格式歌词和逐字歌词
- **详细信息**：包含作词、作曲、音质等详细元数据

## 📜 免责声明

本工具仅限用于学习和研究目的，不得将提取的内容用于任何商业或者非法用途。所有音乐内容的版权归原作者及发行公司所有。用户必须在下载后的24小时内从设备中彻底删除相关内容。任何因使用本工具而导致的版权争议或法律问题，与本项目的开发者无关。
