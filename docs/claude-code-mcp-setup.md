# Claude Code + MCPセットアップガイド

## 前提条件

- Claude Code CLIがインストールされていること
- Node.js 22以上がインストールされていること
- fincode API Keyを取得していること

## NPX版

### MCP設定ファイル

**セキュリティ注意事項**: fincode API Keyを設定ファイルに直接記載するため、ファイルの管理に注意してください。

プロジェクトルートに`.mcp.json`ファイルを作成：

```json
{
  "mcpServers": {
    "fincode-api": {
      "command": "npx",
      "args": ["-y", "@fincode/mcp-api@latest"],
      "env": {
        "FINCODE_API_KEY": "your-api-key",
        "FINCODE_API_LIVE_MODE": "false"
      }
    },
    "fincode-docs": {
      "command": "npx",
      "args": ["-y", "@fincode/mcp-docs@latest"]
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

`.mcp.json`：

```json
{
  "mcpServers": {
    "fincode-api": {
      "command": "docker",
      "args": [
        "run",
        "--rm",
        "-i",
        "fincode-mcp-api:latest"
      ],
      "env": {
        "FINCODE_API_KEY": "your-api-key",
        "FINCODE_API_LIVE_MODE": "false"
      }
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
