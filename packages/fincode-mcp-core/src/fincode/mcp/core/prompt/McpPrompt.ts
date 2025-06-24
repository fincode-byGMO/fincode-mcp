import type { GetPromptResult } from '@modelcontextprotocol/sdk/types.js';
import type { z } from 'zod';
import { McpBaseObject } from '../McpBaseObject.js';

export abstract class McpPrompt<InputSchema extends z.ZodTypeAny> extends McpBaseObject<
    InputSchema,
    GetPromptResult
> {
    abstract readonly argumentSchema: InputSchema;

    async run(args: z.infer<typeof this.argumentSchema>): Promise<GetPromptResult> {
        return {
            description: this.description,
            messages: [
                {
                    role: 'user',
                    content: {
                        type: 'text',
                        text: await this.createPrompt(args),
                    },
                },
            ],
        };
    }

    abstract createPrompt(args: z.infer<typeof this.argumentSchema>): Promise<string>;
}
