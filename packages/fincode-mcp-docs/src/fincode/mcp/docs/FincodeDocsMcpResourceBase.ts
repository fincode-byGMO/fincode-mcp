import {
    type FincodeAPIDocsSearchService,
    McpResource,
    type McpResourceArgument,
} from '@fincode/mcp-core';
import type { ReadResourceResult } from '@modelcontextprotocol/sdk/types.js';
import type { z } from 'zod';

export abstract class FincodeDocsMcpResourceBase extends McpResource {
    protected readonly API_DOCS_URI = 'https://docs.fincode.jp/api';

    constructor(protected searchService: FincodeAPIDocsSearchService) {
        super();
    }

    abstract run(argument: z.infer<McpResourceArgument>): Promise<ReadResourceResult>;

    protected apiDocsUrl(endpoint: string) {
        return this.API_DOCS_URI + endpoint;
    }
}
