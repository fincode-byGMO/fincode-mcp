import { extendZodWithOpenApi } from '@asteasolutions/zod-to-openapi';
import { z } from 'zod';

extendZodWithOpenApi(z);

export const OpenAPIInfoSchema = z.object({
    title: z.string(),
    version: z.string(),
    description: z.string().optional(),
});

export const OpenAPIPathItemSchema = z.object({
    summary: z.string().optional(),
    description: z.string().optional(),
    get: z.any().optional(),
    put: z.any().optional(),
    post: z.any().optional(),
    delete: z.any().optional(),
    options: z.any().optional(),
    head: z.any().optional(),
    patch: z.any().optional(),
    parameters: z.array(z.any()).optional(),
});

export const OpenAPIDocumentSchema = z
    .object({
        openapi: z.string(),
        info: OpenAPIInfoSchema,
        paths: z.record(OpenAPIPathItemSchema),
        components: z
            .object({
                schemas: z.record(z.any()).optional(),
                responses: z.record(z.any()).optional(),
                parameters: z.record(z.any()).optional(),
                examples: z.record(z.any()).optional(),
                requestBodies: z.record(z.any()).optional(),
                headers: z.record(z.any()).optional(),
                securitySchemes: z.record(z.any()).optional(),
                links: z.record(z.any()).optional(),
                callbacks: z.record(z.any()).optional(),
            })
            .optional(),
        tags: z
            .array(
                z.object({
                    name: z.string(),
                    description: z.string().optional(),
                })
            )
            .optional(),
        servers: z
            .array(
                z.object({
                    url: z.string(),
                    description: z.string().optional(),
                })
            )
            .optional(),
    })
    .describe('OpenAPI仕様書');

export type OpenAPIDocument = z.infer<typeof OpenAPIDocumentSchema>;
export type OpenAPIPathItem = z.infer<typeof OpenAPIPathItemSchema>;
