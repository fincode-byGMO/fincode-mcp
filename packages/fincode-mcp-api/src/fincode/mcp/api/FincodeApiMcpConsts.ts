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
    amount: z
        .string()
        .or(z.number())
        .transform((val) => +val)
        .describe('決済金額(円)'),
    guide_mail_send_flag: z
        .enum(['0', '1'])
        .default('1')
        .describe(
            '決済メール 送信フラグ リダイレクト型決済URLを添付したメールをfincodeから送信するかどうかを指定します。0：送信しない 1：送信する（デフォルト）'
        ),
    receiver_mail: z
        .string()
        .describe(
            '決済メールの送信先メールアドレスです。決済URLをfincodeからのメール送信機能で送信する場合には必須です。'
        ),
    mail_customer_name: z
        .string()
        .describe(
            '決済メール中で用いられる購入者の名前です。決済URLをfincodeからのメール送信機能で送信する場合には必須です。'
        ),
    thanks_mail_send_flag: z
        .enum(['0', '1'])
        .default('1')
        .describe(
            '完了メール 送信フラグ 決済が完了した際に購入者に完了メールを送信するかどうかを示します。0：送信しない 1：送信する（デフォルト）'
        ),
    payment_term_day: z
        .number()
        .default(7)
        .describe('コンビニ決済 支払期限日数 店頭レジでの支払い期限日数です。デフォルト7日'),
    konbini_reception_mail_flag: z
        .enum(['0', '1'])
        .default('1')
        .describe(
            'コンビニ決済 支払い画面案内メール送信フラグ コンビニ決済の支払い画面案内メールを送信するかどうかを設定します。0：送信しない 1：送信する（デフォルト）'
        ),
    expire: z.number().default(30).describe('決済URLの有効期限日数です。デフォルト30日'),
});

export const FincodeCreatePaymentUrlSendEmailSchema = z.object({
    amount: z
        .string()
        .or(z.number())
        .transform((val) => String(val))
        .describe('金額(円)'),
    pay_type: z
        .string()
        .transform((val) => {
            const normalized = val.replace(/[\s　]+/g, ',');
            return normalized
                .split(/[,、|｜]+/)
                .filter((v) => v.length > 0)
                .map((v) => {
                    v = v.trim().toLowerCase();
                    return v.charAt(0).toUpperCase() + v.slice(1);
                })
                .filter((v) => v.length > 0);
        })
        .pipe(z.array(FincodePayTypeSchema))
        .describe(
            '決済手段を指定します。複数指定可能です。(Card:カード決済（デフォルト）, Konbini:コンビニ決済, Paypay:PayPay)の配列で指定します。'
        ),
    name: z.string().describe('送付名'),
    email: z.string().email().describe('送付メールアドレス'),
});
