import type { ReadResourceResult } from '@modelcontextprotocol/sdk/types.js';
import { z } from 'zod';
import { McpBaseObject } from '../McpBaseObject.js';

export const McpResourceArgumentSchema = z.object({});

export type McpResourceArgument = typeof McpResourceArgumentSchema;

export abstract class McpResource extends McpBaseObject<McpResourceArgument, ReadResourceResult> {
    abstract readonly uri: string;

    abstract readonly mimeType: string;
}
