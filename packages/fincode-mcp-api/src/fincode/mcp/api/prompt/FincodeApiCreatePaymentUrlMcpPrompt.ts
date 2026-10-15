import { McpPrompt } from '@fincode/mcp-core';
import type { z } from 'zod';
import { FincodeCreatePaymentUrlSendEmailSchema } from '../FincodeApiMcpConsts.js';

export class FincodeApiCreatePaymentUrlMcpPrompt extends McpPrompt<
    typeof FincodeCreatePaymentUrlSendEmailSchema
> {
    readonly name: string = this.text('決済URL作成の呼出');

    readonly description: string = this.text(`
        fincode APIの決済URL作成のエンドポイントを呼び出して、
        指定された顧客にメールで送信するためのプロンプトです。
    `);

    readonly argumentSchema = FincodeCreatePaymentUrlSendEmailSchema;

    async createPrompt(args: z.infer<typeof this.argumentSchema>) {
        const { amount, pay_type, name, email } = args;
        return this.text(`
            fincode APIの決済URL作成のエンドポイントの呼び出して決済URLを作成してください。
            決済URLの引数は下記のとおりです。
            **支払い種別**:${pay_type}
            **金額**:${amount}円
            **送付先**:${name}(${email})
            **決済URL**:メール送信
            **完了メール**:有効
            **コンビニ決済**:店頭レジでの支払い7日
            **コンビニ決済の支払い画面案内メール**:メール送信
            **決済URLの有効期限**:30日
        `);
    }
}
