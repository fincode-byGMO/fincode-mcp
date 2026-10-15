# Claude Desktop + MCPセットアップガイド

## 前提条件

- Claude Desktop（macOS/Windows）がインストールされていること
- Node.js 22以上がインストールされていること（NPX版の場合）
- Docker Desktopがインストールされていること（Docker版の場合）
- fincode API Keyを取得していること

## NPX版

### 1. MCP設定ファイルの準備

Claude Desktopの設定ファイルを開きます：

**macOS:**
```bash
~/Library/Application Support/Claude/claude_desktop_config.json
```

**Windows:**
```
%APPDATA%\Claude\claude_desktop_config.json
```

### 2. Node.jsのパスを確認

```bash
# Node.jsがインストールされているパスを確認
which npx
# 例: /usr/local/bin/npx
```

### 3. MCP設定ファイル

**セキュリティ注意事項**: fincode API Keyを設定ファイルに直接記載するため、ファイルの管理に注意してください。

**注意**: Claude DesktopがNode.jsを見つけられない場合は、フルパスを指定する必要があります。

```json
{
  "mcpServers": {
    "fincode-api": {
      "command": "/usr/local/bin/npx",
      "args": [
        "-y",
        "@fincode/mcp-api@latest"
      ],
      "env": {
        "FINCODE_API_KEY": "あなたのfincode API Key",
        "FINCODE_API_LIVE_MODE": "false"
      }
    },
    "fincode-docs": {
      "command": "/usr/local/bin/npx",
      "args": [
        "-y",
        "@fincode/mcp-docs@latest"
      ]
    }
  }
}
```

## Docker版

### 1. Dockerイメージのビルド

```bash
# プロジェクトルートから実行
# fincode-mcp-apiのビルド
docker build -f packages/fincode-mcp-api/Dockerfile -t fincode-mcp-api:latest .

# fincode-mcp-docsのビルド
docker build -f packages/fincode-mcp-docs/Dockerfile -t fincode-mcp-docs:latest .
```

### 2. MCP設定ファイル

**セキュリティ注意事項**: fincode API Keyを設定ファイルに直接記載するため、ファイルの管理に注意してください。

**注意**: Claude Desktopでは絶対パスが使用できないため、環境変数を直接指定する必要があります。 

```json
{
  "mcpServers": {
    "fincode-api": {
      "command": "docker",
      "args": [
        "run",
        "--rm",
        "-i",
        "-e", "FINCODE_API_KEY=あなたのfincode API Key",
        "-e", "FINCODE_API_LIVE_MODE=false",
        "fincode-mcp-api:latest"
      ]
    },
    "fincode-docs": {
      "command": "docker",
      "args": [
        "run",
        "--rm",
        "-i",
        "fincode-mcp-docs:latest"
      ]
    }
  }
}
```
