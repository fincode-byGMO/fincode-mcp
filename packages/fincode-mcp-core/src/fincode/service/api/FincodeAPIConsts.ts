import { z } from 'zod';

export const FincodeApiConfigSchema = z.object({
    apiKey: z.string().describe('fincode api key'),
    isLiveMode: z
        .boolean()
        .optional()
        .describe('本番モードかどうか。trueの場合は本番環境、falseの場合はテスト環境'),
    options: z.any().optional().describe('fincode api 初期化オプション'),
});

export type FincodeApiConfig = z.infer<typeof FincodeApiConfigSchema>;
