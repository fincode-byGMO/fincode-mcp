import { createFincode, type Fincode, FincodeAPIError, FincodeSDKError } from '@fincode/node';
import type { FincodeApiConfig } from './FincodeAPIConsts.js';

export abstract class FincodeAPIBaseService<T, R> {
    protected fincode: Fincode;

    protected constructor(protected apiConfig: FincodeApiConfig) {
        this.fincode = createFincode(this.apiConfig);
    }

    async invoke(request: T): Promise<R> {
        try {
            return await this.call(request);
        } catch (error: unknown) {
            if (error instanceof FincodeAPIError) {
                throw new Error(error.message);
            }
            if (error instanceof FincodeSDKError) {
                throw new Error(error.message);
            }
            const errorMessage = error instanceof Error ? error.message : String(error);
            throw new Error(errorMessage);
        }
    }

    protected abstract call(request: T): Promise<R>;
}
