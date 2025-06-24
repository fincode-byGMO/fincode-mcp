import { z } from 'zod';

export const FincodePayTypeSchema = z
    .enum(['Card', 'Konbini', 'Paypay'])
    .describe('決済手段(Card:カード決済, Konbini:コンビニ決済, Paypay:PayPay)');

export const FincodeCreatePaymentInputSchema = z.object({
    pay_type: z
        .array(FincodePayTypeSchema)
        .describe(
            '決済手段を指定します。複数指定可能です。(Card:カード決済（デフォルト）, Konbini:コンビニ決済, Paypay:PayPay)の配列で指定します。'
        ),
    amount: z.string().describe('決済金額(円)'),
    guide_mail_send_flag: z
        .enum(['0', '1'])
        .default('0')
        .describe(
            '決済メール 送信フラグ リダイレクト型決済URLを添付したメールをfincodeから送信するかどうかを指定します。0：送信しない（デフォルト）1：送信する'
        ),
    receiver_mail: z
        .string()
        .optional()
        .describe(
            '決済メールの送信先メールアドレスです。決済URLをfincodeからのメール送信機能で送信する場合には必須です。'
        ),
    mail_customer_name: z
        .string()
        .optional()
        .describe(
            '決済メール中で用いられる購入者の名前です。決済URLをfincodeからのメール送信機能で送信する場合には必須です。'
        ),
    thanks_mail_send_flag: z
        .enum(['0', '1'])
        .default('0')
        .describe(
            '完了メール 送信フラグ 決済が完了した際に購入者に完了メールを送信するかどうかを示します。0：送信しない（デフォルト）1：送信する'
        ),
});

export const FincodeCreatePaymentUrlSendEmailSchema = z.object({
    amount: z
        .string()
        .or(z.number())
        .transform((val) => String(val))
        .describe('金額(円)'),
    payment_type: z.string().describe('支払い種別(カード,PayPay,Konbini)'),
    name: z.string().describe('送付名'),
    email: z.string().email().describe('送付メールアドレス'),
});
