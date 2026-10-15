import * as console from 'node:console';
import { FincodeAPICreateSessionService, type FincodeApiConfig } from '@fincode/mcp-core';
import type { CreatingPaymentSessionRequest } from '@fincode/node';
import { type CallToolResultSchema, ErrorCode } from '@modelcontextprotocol/sdk/types.js';
import type { z } from 'zod';
import { FincodeCreatePaymentInputSchema } from '../FincodeApiMcpConsts.js';
import { FincodeApiMcpToolBase } from '../FincodeApiMcpToolBase.js';

type ExtendedCreatingPaymentSessionRequest = CreatingPaymentSessionRequest & {
    mail_customer_name?: string;
};

export class FincodeApiCreatePaymentUrlMcpTool extends FincodeApiMcpToolBase<
    typeof FincodeCreatePaymentInputSchema
> {
    readonly name: string = this.text('Call-CreatePaymentUrl-API');

    readonly description: string = this.text(`
        fincodeが提供するリダイレクト型決済URLを作成するAPIを呼び出します。
        トランザクションの金額と支払い方法が引数です。生成された決済セッションのURLが結果になります。
        決済手段は、カード決済、コンビニ決済、PayPayなど指定でき、任意でメール送信機能も利用可能です。
        メール機能については、決済URLを含むガイドメールの送信と決済完了後のサンクスメールの送信が設定可能です。
        receiver_mailパラメータでメールの送信先を指定し、mail_customer_nameでメール中の購入名を設定可能です。
        コンビニ決済は、店頭レジでの支払い期限日数が指定できます。また、コンビニ決済の支払い画面案内メールを送信するかどうかを設定可能です。
        決済URLの有効期限を日数で指定可能です。
    `);

    readonly inputSchema = FincodeCreatePaymentInputSchema;

    private service: FincodeAPICreateSessionService;

    constructor(protected apiConfig: FincodeApiConfig) {
        super(apiConfig);
        this.service = new FincodeAPICreateSessionService(apiConfig);
    }

    async call(
        args: z.infer<typeof this.inputSchema>
    ): Promise<z.infer<typeof CallToolResultSchema.shape.structuredContent>> {
        const request: ExtendedCreatingPaymentSessionRequest = {
            transaction: {
                pay_type: args.pay_type,
                amount: String(args.amount),
            },
            card: {
                job_code: 'CAPTURE',
                tds_type: '2',
                tds2_type: '2',
                tds2_email: args.receiver_mail,
            },
            paypay: {
                job_code: 'CAPTURE',
            },
            konbini: {
                payment_term_day: String(args.payment_term_day),
                konbini_reception_mail_flag: args.konbini_reception_mail_flag,
            },
            guide_mail_send_flag: args.guide_mail_send_flag,
            thanks_mail_send_flag: args.thanks_mail_send_flag,
            receiver_mail: args.receiver_mail,
            mail_customer_name: args.mail_customer_name,
            expire: this.formatExpireDate(args.expire),
        };
        try {
            return this.service.invoke(request);
        } catch (error: unknown) {
            throw this.newMcpError(ErrorCode.InternalError, error);
        }
    }

    private formatExpireDate(days: number): string {
        const now = new Date();
        const expireDate = new Date(now.getTime() + days * 24 * 60 * 60 * 1000);

        const year = expireDate.getFullYear();
        const month = String(expireDate.getMonth() + 1).padStart(2, '0');
        const day = String(expireDate.getDate()).padStart(2, '0');
        const hours = String(expireDate.getHours()).padStart(2, '0');
        const minutes = String(expireDate.getMinutes()).padStart(2, '0');
        const seconds = String(expireDate.getSeconds()).padStart(2, '0');

        return `${year}/${month}/${day} ${hours}:${minutes}:${seconds}`;
    }
}
