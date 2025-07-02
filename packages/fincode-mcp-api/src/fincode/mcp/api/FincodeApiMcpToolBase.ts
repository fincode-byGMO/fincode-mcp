import { type FincodeApiConfig, McpTool } from '@fincode/mcp-core';
import { type CallToolResultSchema, ErrorCode } from '@modelcontextprotocol/sdk/types.js';
import type { z } from 'zod';

export abstract class FincodeApiMcpToolBase<Input extends z.ZodTypeAny> extends McpTool<Input> {
    protected constructor(protected apiConfig: FincodeApiConfig) {
        super();
    }

    async run(args: z.infer<Input>) {
        if (this.apiConfig === undefined) {
            throw this.newMcpError(ErrorCode.InvalidRequest, 'fincode API key is not set');
        }
        try {
            const result = await this.call(args);
            return this.createTextContent(result);
        } catch (error: unknown) {
            throw this.newMcpError(ErrorCode.InvalidRequest, error);
        }
    }

    abstract call(
        args: z.infer<Input>
    ): Promise<z.infer<typeof CallToolResultSchema.shape.structuredContent>>;
}
