
# fincode MCP Server

## 概要
このプロジェクトは、[fincode API](https://docs.fincode.jp/api)をModel Context Protocol (MCP) サーバーとして利用できるようにするためのツールを提供します。

### 主な機能
- **fincode-mcp-api**
  - fincodeのAPIを直接呼び出すためのMCPサーバー
  - 決済URL作成API実行ツール `Call-CreatePaymentUrl-API` を提供
    - `Call-CreatePaymentUrl-API` は、fincodeの決済URL作成APIを実行することができます。
    これにより、fincodeのリダイレクト型決済で必要な決済URLを生成し、ユーザーに提供することが可能です。
- **fincode-mcp-docs**
  - fincodeのOpenAPI SpecをベースにAPI仕様を回答するMCPサーバー
  現在は決済URL作成APIについての仕様を提供しています。
  - 決済URL作成APIについて回答するツール `Get-CreatePaymentUrl-Docs` を提供

## 前提条件
- Node.js v22以上
- pnpm v8.0.0以上

## セットアップ手順

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

#### npxを利用してインストールする場合
```json
{
  "mcpServers": {
    "fincode-mcp-api": {
      "command": "npx",
      "args": [
        "fincode-mcp-api",
      ],
      "env": {
        "PATH": "NODE_PATH",
        "FINCODE_API_KEY": "YOUR_FINCODE_API_KEY",
        "FINCODE_API_LIVE_MODE": "false",
        "FINCODE_API_PROXY": "YOUR_PROXY_URL"
      }
    },
    "fincode-mcp-docs": {
      "command": "npx",
      "args": [
        "fincode-mcp-docs"
      ],
      "env": {
        "PATH": "NODE_PATH"
      }
    }
  }
}
```

#### ローカル環境でビルドしてからインストールする場合
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
        "FINCODE_API_LIVE_MODE": "false",
        "FINCODE_API_PROXY": "YOUR_PROXY_URL"
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
**注意：** `FINCODE_API_PROXY` は必要に応じてプロキシのURLを指定してください。プロキシを使用しない場合は省略可能です。  
**注意：** `args` のパスは、実際のプロジェクトのパスに合わせて調整してください。

### VSCode
`.vscode/mcp.json` ファイルを以下の内容で編集してください：

#### npxを利用してインストールする場合
```json
{
  "servers": {
    "fincode-mcp-api": {
      "command": "npx",
      "args": [
        "fincode-mcp-api",
      ],
      "env": {
        "PATH": "NODE_PATH",
        "FINCODE_API_KEY": "YOUR_FINCODE_API_KEY",
        "FINCODE_API_LIVE_MODE": "false",
        "FINCODE_API_PROXY": "YOUR_PROXY_URL"
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

#### ローカル環境でビルドしてからインストールする場合
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
        "FINCODE_API_LIVE_MODE": "false",
        "FINCODE_API_PROXY": "YOUR_PROXY_URL"
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

