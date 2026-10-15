import type { GetPromptResult } from '@modelcontextprotocol/sdk/types.js';
import type { z } from 'zod';
import { McpBaseObjectProvider } from '../McpBaseObjectProvider.js';
import type { McpPrompt } from './McpPrompt.js';

export class McpPromptProvider extends McpBaseObjectProvider<
    McpPrompt<z.ZodTypeAny>,
    GetPromptResult
> {}
