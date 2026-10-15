import type { ReadResourceResult } from '@modelcontextprotocol/sdk/types.js';
import { McpBaseObjectProvider } from '../McpBaseObjectProvider.js';
import type { McpResource } from './McpResource.js';

export class McpResourceProvider extends McpBaseObjectProvider<McpResource, ReadResourceResult> {}
