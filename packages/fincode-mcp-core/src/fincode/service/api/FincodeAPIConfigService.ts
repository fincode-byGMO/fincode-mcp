import type { FincodeApiConfig } from './FincodeAPIConsts.js';

export class FincodeAPIConfigService {
    fromEnv(): FincodeApiConfig {
        const args = process.argv.slice(2);
        const isLiveModeIndex = args.findIndex((arg) => arg.startsWith('--isLiveMode='));
        let isLiveMode = false;
        if (isLiveModeIndex !== -1) {
            const isLiveModeValue = args[isLiveModeIndex].split('=')[1];
            isLiveMode = isLiveModeValue === 'true';
            args.splice(isLiveModeIndex, 1);
        }
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
