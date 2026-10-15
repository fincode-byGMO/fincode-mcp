# VS Code + MCPセットアップガイド

## 前提条件

- VS Codeがインストールされていること
- Node.js 22以上がインストールされていること
- GitHub Copilot拡張機能がインストールされていること
- fincode API Keyを取得していること

## Agent Modeの有効化

1. VS Codeの設定で`chat.agent.enabled`を有効にする
2. Chatビューを開き、GitHubにサインイン
3. Chat modeドロップダウンで「Agent」を選択

## NPX版

### MCP設定ファイル

**セキュリティ注意事項**: fincode API Keyを設定ファイルに直接記載するため、ファイルの管理に注意してください。

プロジェクトの`.vscode/mcp.json`ファイルを作成：

```json
{
  "servers": {
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

`.vscode/mcp.json`：

```json
{
  "servers": {
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

### 自動検出版

VS Codeの設定（settings.json）に以下を追加：

```json
{
  "chat.mcp.discovery.enabled": true
}
```

### Claude Desktop設定ファイルの場所

- **macOS**: `~/Library/Application Support/Claude/claude_desktop_config.json`
- **Windows**: `%APPDATA%\Claude\claude_desktop_config.json`

### 注意事項

- `.vscode/mcp.json`の設定が優先されます
- 自動検出された設定は補助的に使用されます
- 自動検出を無効にしたい場合は、上記の設定を`false`に設定してください
