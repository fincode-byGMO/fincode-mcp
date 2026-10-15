import type { FincodeApiConfig } from './FincodeAPIConsts.js';

export class FincodeAPIConfigService {
    fromEnv(): FincodeApiConfig {
        // 環境変数からisLiveModeを取得
        const isLiveMode = process.env.FINCODE_API_LIVE_MODE === 'true';
        
        const apiKey = process.env.FINCODE_API_KEY;
        if (apiKey === undefined) {
            throw new Error('env.FINCODE_API_KEY is not set');
        }

        const proxy = process.env.FINCODE_API_PROXY || process.env.HTTP_PROXY || process.env.HTTPS_PROXY;
        return {
            apiKey: apiKey,
            isLiveMode: isLiveMode,
            options: {
                proxyAgent: proxy,
            }
        };
    }
}
