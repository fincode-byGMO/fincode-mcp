import { type FincodeAPIDocsSearchService, McpTool } from '@fincode/mcp-core';
import type { z } from 'zod';
import { FincodeDocsInputSchema } from './FincodeDocsMcpConsts.js';

export abstract class FincodeDocsMcpToolBase extends McpTool<typeof FincodeDocsInputSchema> {
    abstract readonly uri: string;

    readonly inputSchema = FincodeDocsInputSchema;

    constructor(private docsSearchService: FincodeAPIDocsSearchService) {
        super();
    }

    async run(_: z.infer<typeof FincodeDocsInputSchema>) {
        const documentText = this.docsSearchService.searchByPath(this.uri);
        return this.createTextContent(documentText);
    }
}
