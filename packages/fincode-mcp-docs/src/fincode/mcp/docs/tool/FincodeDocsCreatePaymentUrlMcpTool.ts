import { FincodeDocsMcpToolBase } from '../FincodeDocsMcpToolBase.js';

export class FincodeDocsCreatePaymentUrlMcpTool extends FincodeDocsMcpToolBase {
    readonly uri = this.text('/v1/sessions#post');

    readonly name = this.text('Get-CreatePaymentUrl-Docs');

    readonly description = this.text(`
        Fincode APIの決済URL作成のエンドポイントのドキュメントを提供します。
    `);
}
