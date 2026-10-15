import type { FincodeAPIDocsSearchService, McpResourceArgument } from '@fincode/mcp-core';
import type { ReadResourceResult } from '@modelcontextprotocol/sdk/types.js';
import { ErrorCode } from '@modelcontextprotocol/sdk/types.js';
import type { z } from 'zod';
import { FincodeDocsMcpResourceBase } from './FincodeDocsMcpResourceBase.js';

export abstract class FincodeDocsMcpPathResourceBase extends FincodeDocsMcpResourceBase {
    constructor(protected searchService: FincodeAPIDocsSearchService) {
        super(searchService);
    }

    async run(_: z.infer<McpResourceArgument>): Promise<ReadResourceResult> {
        try {
            const path = this.uri.replace(this.API_DOCS_URI, '');
            const document = this.searchService.searchByPath(path);
            const tags = this.searchService.tags();
            const response = JSON.stringify([
                {
                    description: 'fincode apiのエンドポイントの共通の仕様',
                    docs: tags,
                },
                {
                    description: this.text(this.description),
                    docs: document,
                },
            ]);
            return {
                contents: [
                    {
                        uri: this.uri,
                        mimeType: this.mimeType,
                        text: response,
                    },
                ],
            };
        } catch (error: unknown) {
            throw this.newMcpError(ErrorCode.InvalidRequest, error);
        }
    }

    protected apiDocsUrl(endpoint: string) {
        return this.API_DOCS_URI + endpoint;
    }
}
