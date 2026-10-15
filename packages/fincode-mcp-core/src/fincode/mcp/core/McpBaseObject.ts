import { type ErrorCode, McpError } from '@modelcontextprotocol/sdk/types.js';
import type { z } from 'zod';

export abstract class McpBaseObject<InputSchema extends z.ZodTypeAny, Response> {
    private _enabled: boolean = true;

    get enabled(): boolean {
        return this._enabled;
    }

    set enabled(value: boolean) {
        this._enabled = value;
    }

    abstract readonly name: string;

    abstract readonly description: string;

    abstract run(args: z.infer<InputSchema>): Promise<Response>;

    async execute(args: unknown = {}) {
        return await this.run(args);
    }

    protected newMcpError(errorCode: ErrorCode, error: Error | string | unknown): McpError {
        const errorMessage = error instanceof Error ? error.message : String(error);
        return new McpError(errorCode, errorMessage);
    }

    protected text(value: string): string {
        return value
            .replace(/[\t\r]/gm, '')
            .replace(/ {4}/gm, '')
            .replace(/^\n/gm, '')
            .replace(/\n$/gm, '')
            .trim();
    }
}
