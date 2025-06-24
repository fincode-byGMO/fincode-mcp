import {
    type CallToolResult,
    type CallToolResultSchema,
    ErrorCode,
} from '@modelcontextprotocol/sdk/types.js';
import type { z } from 'zod';
import { McpBaseObject } from '../McpBaseObject.js';

export abstract class McpTool<InputSchema extends z.ZodTypeAny> extends McpBaseObject<
    InputSchema,
    CallToolResult
> {
    abstract readonly inputSchema: InputSchema;

    outputSchema: z.ZodTypeAny | undefined;

    override async execute(args: unknown) {
        const validatedArgs = this.validateArgs(args);
        return await this.run(validatedArgs);
    }

    private validateArgs(args: unknown): z.infer<InputSchema> {
        const parseResult = this.inputSchema.safeParse(args);
        if (!parseResult.success) {
            throw this.newMcpError(
                ErrorCode.InvalidParams,
                `Invalid arguments ${this.name}: ${parseResult.error.message}`
            );
        }
        return parseResult.data;
    }

    protected createTextContent(
        result: z.infer<typeof CallToolResultSchema.shape.structuredContent>
    ): CallToolResult {
        return {
            content: [{ type: 'text', text: JSON.stringify(result) }],
            isError: false,
        };
    }

    protected createStructuredContent(
        result: z.infer<typeof CallToolResultSchema.shape.structuredContent>
    ): CallToolResult {
        return {
            content: [{ type: 'text', text: 'structuredContent' }],
            structuredContent: result,
            isError: false,
        };
    }
}
