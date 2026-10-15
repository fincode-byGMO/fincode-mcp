import type { CreatingPaymentSessionRequest, PaymentSessionObject } from '@fincode/node';
import { FincodeAPIBaseService } from './FincodeAPIBaseService.js';
import type { FincodeApiConfig } from './FincodeAPIConsts.js';

export class FincodeAPICreateSessionService extends FincodeAPIBaseService<
    CreatingPaymentSessionRequest,
    PaymentSessionObject
> {
    constructor(protected apiConfig: FincodeApiConfig) {
        super(apiConfig);
    }

    async call(request: CreatingPaymentSessionRequest) {
        return await this.fincode.paymentSessions.create(request);
    }
}
