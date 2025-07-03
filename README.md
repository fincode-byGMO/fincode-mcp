
# Fincode MCP Server

## 概要

このプロジェクトは、fincode APIをModel Context Protocol (MCP) サーバーとして利用できるようにするためのパッケージ群です。

### 提供パッケージ

- **fincode-mcp-api**
  - fincodeのAPIを直接呼び出すためのMCPサーバー
  - 決済URL作成API実行ツール `Call-CreatePaymentUrl-API` を提供
- **fincode-mcp-docs**
  - fincodeのOpenAPI仕様をベースにAPI仕様を回答するMCPサーバー
  - 決済URL作成APIについて回答するツール `Get-CreatePaymentUrl-Docs` を提供

## 前提条件

- Node.js v22以上
- pnpm v8.0.0以上

## セットアップ手順(2025年07月03日時点)
今回提供したファイルには、ビルド済みファイルをセットしています。
そのため、インストールとビルド手順はしなくてもMCPサーバーの設定は可能です。

### Claude DesktopやVSCodeで必要なファイル

- `fincode-mcp/packages/fincode-mcp-api/dist/index.bundled.js"`
- `fincode-mcp/packages/fincode-mcp-docs/dist/index.bundled.js"`

### Claude Desktopの拡張機能(dxt形式)で必要なファイル
- `fincode-mcp/packages/fincode-mcp-docs/fincode-mcp-docs.dxt`
- `fincode-mcp/packages/fincode-mcp-api/fincode-mcp-api.dxt`

### インストールとビルド

#### 手動インストールの場合

```bash
# 依存関係のインストール
pnpm install

# プロジェクトのビルド
pnpm build:bundle:prd
```


## MCPサーバーの設定

### Claude Desktop

`claude_desktop_config.json` ファイルを以下の内容で編集してください：

```json
{
  "mcpServers": {
    "fincode-mcp-api": {
      "command": "node",
      "args": [
        "$WD/fincode-mcp/packages/fincode-mcp-api/dist/index.bundled.js",
      ],
      "env": {
        "PATH": "NODE_PATH",
        "FINCODE_API_KEY": "YOUR_FINCODE_API_KEY",
        "FINCODE_API_LIVE_MODE": "false"
      }
    },
    "fincode-mcp-docs": {
      "command": "node",
      "args": [
        "$WD/fincode-mcp/packages/fincode-mcp-docs/dist/index.bundled.js"
      ],
      "env": {
        "PATH": "NODE_PATH"
      }
    }
  }
}
```

**注意：** `PATH` は省略可能です。
**注意：** `FINCODE_API_KEY` を実際のAPIキーに置き換えてください。
**注意：** `FINCODE_API_LIVE_MODE` は`false`の場合はfincodeテスト環境(`api.test.fincode.jp`)、`true`の場合はfincode本番環境でAPIを実行します。デフォルトは`false`です。
**注意：** `args` のパスは、実際のプロジェクトのパスに合わせて調整してください。

### VSCode

`.vscode/mcp.json` ファイルを以下の内容で編集してください：

```json
{
  "servers": {
    "fincode-mcp-api": {
      "command": "node",
      "args": [
        "$WD/fincode-mcp/packages/fincode-mcp-api/dist/index.bundled.js",
      ],
      "env": {
        "PATH": "NODE_PATH",
        "FINCODE_API_KEY": "YOUR_FINCODE_API_KEY",
        "FINCODE_API_LIVE_MODE": "false"
      }
    },
    "fincode-mcp-docs": {
      "command": "node",
      "args": [
        "$WD/fincode-mcp/packages/fincode-mcp-docs/dist/index.bundled.js"
      ],
      "env": {
        "PATH": "NODE_PATH"
      }
    }
  }
}
```

#### Claude Desktopの拡張機能(dxt形式)としてインストールする場合

以下の手順でdxt形式の拡張機能を生成し、Claudeにインストールします。

```bash
# 依存関係のインストール
pnpm install

# プロジェクトのビルド
pnpm build:dxt
```

- `fincode-mcp/packages/fincode-mcp-docs/fincode-mcp-docs.dxt`
- `fincode-mcp/packages/fincode-mcp-api/fincode-mcp-api.dxt`
が生成されるため、これらをClaudeの拡張機能としてインストールします。  

Claude Desktopの左上メニューのファイル>設定(Ctrl+,)を開き、「エクステンション」に移動します。  
画面下部の「詳細設定」を選択して「エクステンションをインストール...」を選択して、任意のdxtファイルを選択します。  
これでインストールすることで「エクステンション」画面にfincodeのMCPサーバーが表示されます。  
`@fincode/mcp-api`の場合は詳細設定を開いて、「fincode api key」の項目にfincodeテスト環境のAPIキーを入力して保存することで、
APIを利用できるようになります。

