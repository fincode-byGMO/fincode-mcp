FROM node:22-alpine AS builder

# pnpmをインストール
RUN corepack enable && corepack prepare pnpm@8.15.0 --activate

WORKDIR /workspace

# monorepoの設定ファイルをコピー
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml tsconfig*.json ./

# 各パッケージのpackage.jsonをコピー（依存関係の解決に必要）
COPY packages/fincode-mcp-core/package.json ./packages/fincode-mcp-core/
COPY packages/fincode-mcp-api/package.json ./packages/fincode-mcp-api/

# 依存関係をインストール（fincode-mcp-apiとその依存関係のみ）
RUN --mount=type=cache,target=/root/.local/share/pnpm/store \
    pnpm install --frozen-lockfile --filter @fincode/mcp-api...

# ソースコードをコピー
COPY packages/fincode-mcp-core ./packages/fincode-mcp-core
COPY packages/fincode-mcp-api ./packages/fincode-mcp-api

# ビルド
RUN pnpm --filter @fincode/mcp-api run build:prd


FROM node:22-alpine AS release

WORKDIR /app

# バンドルファイルのみコピー（全ての依存関係が含まれている）
COPY --from=builder /workspace/packages/fincode-mcp-api/dist/index.bundled.js ./

ENV NODE_ENV=production

ENTRYPOINT ["node", "/app/index.bundled.js"]