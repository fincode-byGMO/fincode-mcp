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
        Fincodeが提供するリダイレクト型決済URLを作成するAPIを呼び出します。
        トランザクションの金額と支払い方法が引数です。生成された決済セッションのURLが結果になります。
        決済手段は、カード決済、コンビニ決済、PayPayなど指定でき、任意でメール送信機能も利用できます。
        メール機能については、決済URLを含むガイドメールの送信と決済完了後のサンクスメールの送信が設定可能です。
        receiver_mailパラメータでメールの送信先を指定し、mail_customer_nameでメール中の購入名を設定できます。
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
                amount: args.amount,
            },
            card: {
                job_code: 'CAPTURE',
                tds_type: '2',
                tds2_type: '2',
                tds2_email: args.receiver_mail, //FIXME
            },
            //FIXME
            // paypay: {
            //     job_code: 'CAPTURE',
            // },
            // konbini:{
            //     payment_term_day:7//FIXME //プロンプト上書き可能
            //     konbini_reception_mail_send_flag: 1//FIXME //プロンプト上書き可能
            // },
            // expire: 30 //プロンプト上書き可能//日
        };
        if (args.guide_mail_send_flag) {
            request.guide_mail_send_flag = args.guide_mail_send_flag;
        }
        if (args.mail_customer_name) {
            request.mail_customer_name = args.mail_customer_name;
        }
        if (args.receiver_mail) {
            request.receiver_mail = args.receiver_mail;
        }
        if (args.thanks_mail_send_flag) {
            request.thanks_mail_send_flag = args.thanks_mail_send_flag;
        }
        try {
            return this.service.invoke(request);
        } catch (error: unknown) {
            throw this.newMcpError(ErrorCode.InternalError, error);
        }
    }
}
