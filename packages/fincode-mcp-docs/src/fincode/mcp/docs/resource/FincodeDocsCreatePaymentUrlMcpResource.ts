import { FincodeDocsMcpPathResourceBase } from '../FincodeDocsMcpPathResourceBase.js';

export class FincodeDocsCreatePaymentUrlMcpResource extends FincodeDocsMcpPathResourceBase {
    readonly uri = this.apiDocsUrl('/v1/sessions#post');

    readonly name = this.text('ドキュメント:決済URL作成');

    readonly description = this.text(`
        Fincode APIの決済URL作成のエンドポイントのドキュメントです。
    `);

    readonly mimeType = this.text('application/json');
}
