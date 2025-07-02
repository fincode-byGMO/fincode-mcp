import type { FincodeApiConfig } from './FincodeAPIConsts.js';

export class FincodeAPIConfigService {
    fromEnv(): FincodeApiConfig {
        // 環境変数からisLiveModeを取得
        const isLiveMode = process.env.FINCODE_API_LIVE_MODE === 'true';
        
        const apiKey = process.env.FINCODE_API_KEY;
        if (apiKey === undefined) {
            throw new Error('env.FINCODE_API_KEY is not set');
        }
        
        return {
            apiKey: apiKey,
            isLiveMode: isLiveMode,
        };
    }
}
