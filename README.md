# 微信群聊内容自动总结应用

一个基于React和TypeScript的应用程序，可以自动获取指定微信群聊消息，使用Deepseek API进行内容总结分析，并定时生成精美海报。该应用提供美观简洁的UI界面和丰富的微交互效果。

![应用截图](https://placeholder-for-app-screenshot.com)

## 功能特点

- **群聊内容总结**：自动获取微信群聊消息并使用AI生成结构化总结
- **多种总结格式**：支持不同长度、风格和详细程度的总结
- **海报生成**：将总结内容转化为精美的分享海报
- **定时任务**：支持设置自动总结和海报生成的定时计划
- **历史记录**：浏览和管理历史总结和生成的海报
- **自定义主题**：支持浅色/深色模式和多种颜色主题

## 安装和运行

### 前提条件

- Node.js 16.x 或更高版本
- npm 7.x 或更高版本
- Deepseek API 密钥（用于AI内容总结）

### 安装步骤

1. 克隆项目到本地

```bash
git clone https://github.com/yourusername/wechat-summary-app.git
cd wechat-summary-app
```

2. 安装依赖

```bash
npm install
```

3. 配置环境变量

复制示例环境变量文件并进行配置：

```bash
cp .env.example .env
```

编辑 `.env` 文件，添加您的Deepseek API密钥和其他必要配置。

4. 启动开发服务器

```bash
npm run dev
```

应用将在 http://localhost:5173 启动。

### 构建生产版本

```bash
npm run build
```

生成的文件将位于 `dist` 目录中，可以部署到任何静态网站托管服务。

## 技术栈

- **前端框架**：React 18
- **语言**：TypeScript
- **构建工具**：Vite
- **状态管理**：React Context API + React Query
- **UI组件**：自定义组件 + Headless UI
- **样式**：Tailwind CSS
- **动画**：Framer Motion
- **HTTP客户端**：Axios
- **日期处理**：date-fns
- **AI服务**：Deepseek API

## API密钥配置说明

### Deepseek API配置

本应用使用Deepseek API进行内容总结和海报文案生成。要配置API密钥：

1. 注册[Deepseek平台](https://platform.deepseek.com/)账户
2. 在开发者控制台创建一个API密钥
3. 将API密钥添加到 `.env` 文件中：

```
VITE_DEEPSEEK_API_KEY=your_deepseek_api_key_here
VITE_DEEPSEEK_API_URL=https://api.deepseek.com/v1
```

### 环境变量说明

- `VITE_DEEPSEEK_API_KEY`：Deepseek API密钥
- `VITE_DEEPSEEK_API_URL`：Deepseek API端点URL
- `VITE_APP_NAME`：应用名称
- `VITE_APP_VERSION`：应用版本
- `VITE_ENABLE_AUTO_SUMMARY`：是否启用自动总结功能
- `VITE_ENABLE_POSTER_GENERATION`：是否启用海报生成功能
- `VITE_DEFAULT_SUMMARY_INTERVAL`：默认总结间隔（小时）
- `VITE_DEFAULT_POSTER_SCHEDULE`：默认海报生成频率

## 使用说明

1. 在首页查看概览和最近总结
2. 在"聊天总结"页面查看群聊内容并生成总结
3. 使用"海报生成器"创建基于总结内容的分享海报
4. 在"设置"页面配置API密钥和个性化界面主题

## 贡献指南

欢迎提交问题报告和拉取请求。请确保遵循项目的代码风格和提交消息规范。

## 许可证

本项目采用 MIT 许可证 - 详情请查看 [LICENSE](LICENSE) 文件。

## 联系方式

如有任何问题或建议，请通过以下方式联系我们：

- 电子邮件：contact@example.com
- GitHub Issues：[提交问题](https://github.com/yourusername/wechat-summary-app/issues)