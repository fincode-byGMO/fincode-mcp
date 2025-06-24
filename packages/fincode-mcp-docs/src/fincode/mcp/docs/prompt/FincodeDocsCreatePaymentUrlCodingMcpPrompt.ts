import { McpPrompt } from '@fincode/mcp-core';
import type { z } from 'zod';
import { FincodeDocsArgumentSchema } from '../FincodeDocsMcpConsts.js';

export class FincodeDocsCreatePaymentUrlCodingMcpPrompt extends McpPrompt<
    typeof FincodeDocsArgumentSchema
> {
    readonly name: string = this.text('決済URL作成の呼出コード作成');

    readonly description: string = this.text(`
        Fincode APIの決済URL作成のエンドポイントのドキュメントをもとに使用するサンプルコードを取得するプロンプトです。
    `);

    readonly argumentSchema = FincodeDocsArgumentSchema;

    async createPrompt(args: z.infer<typeof this.argumentSchema>) {
        const { language } = args;
        return this.text(`
            Fincode APIの決済URL作成を使用するサンプルコードを${language}言語でください。
            済決済URL作成のドキュメントリソースを参照してください。
        `);
    }
}
