import { z } from 'zod';

export const FincodeDocsArgumentSchema = z.object({
    language: z.string().describe('プログラミング言語'),
});

export const FincodeDocsInputSchema = z.object({});
