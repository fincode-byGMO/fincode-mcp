import type { CallToolResult } from '@modelcontextprotocol/sdk/types.js';
import type { z } from 'zod';
import { McpBaseObjectProvider } from '../McpBaseObjectProvider.js';
import type { McpTool } from './McpTool.js';

export class McpToolProvider extends McpBaseObjectProvider<McpTool<z.ZodTypeAny>, CallToolResult> {}
