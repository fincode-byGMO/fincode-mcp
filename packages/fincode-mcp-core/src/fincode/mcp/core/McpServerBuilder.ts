import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import type { z } from 'zod';
import type { McpPrompt } from './prompt/McpPrompt.js';
import { McpPromptProvider } from './prompt/McpPromptProvider.js';
import type { McpResource } from './resource/McpResource.js';
import { McpResourceProvider } from './resource/McpResourceProvider.js';
import type { McpTool } from './tool/McpTool.js';
import { McpToolProvider } from './tool/McpToolProvider.js';

export class McpServerBuilder {
    private toolProvider?: McpToolProvider;
    private promptProvider?: McpPromptProvider;
    private resourceProvider?: McpResourceProvider;
    private name?: string;
    private version?: string;

    private constructor() {}

    static builder(): McpServerBuilder {
        return new McpServerBuilder();
    }

    server(name: string, version: string): McpServerBuilder {
        this.name = name;
        this.version = version;
        return this;
    }

    tools(...toolInstances: McpTool<z.ZodTypeAny>[]): McpServerBuilder {
        this.toolProvider = new McpToolProvider(toolInstances);
        return this;
    }

    prompts(...promptInstances: McpPrompt<z.ZodTypeAny>[]): McpServerBuilder {
        this.promptProvider = new McpPromptProvider(promptInstances);
        return this;
    }

    resources(...resourceInstances: McpResource[]): McpServerBuilder {
        this.resourceProvider = new McpResourceProvider(resourceInstances);
        return this;
    }

    private buildServer(): McpServer {
        if (!this.name) {
            throw new Error('Server name is not set');
        }
        if (!this.version) {
            throw new Error('Server version is not set');
        }
        const capabilities = {
            tools: this.toolProvider ? { listChanged: true } : undefined,
            prompts: this.promptProvider ? { listChanged: true } : undefined,
            resources: this.resourceProvider ? { listChanged: true } : undefined,
        };
        return new McpServer(
            {
                name: this.name,
                version: this.version,
            },
            {
                capabilities: capabilities,
            }
        );
    }

    private buildTools(server: McpServer): void {
        if (!this.toolProvider) {
            return;
        }

        const tools = this.toolProvider.list();
        for (const tool of tools) {
            const inputSchemaShape = (tool.inputSchema as z.AnyZodObject).shape;
            if (tool.outputSchema) {
                const outputSchemaShape = (tool.outputSchema as z.AnyZodObject).shape;
                server.tool(
                    tool.name,
                    tool.description,
                    inputSchemaShape,
                    outputSchemaShape,
                    async (args: Record<string, unknown>) => {
                        return await tool.execute(args);
                    }
                );
            } else {
                server.tool(
                    tool.name,
                    tool.description,
                    inputSchemaShape,
                    async (args: Record<string, unknown>) => {
                        return await tool.execute(args);
                    }
                );
            }
        }
    }

    private buildPrompts(server: McpServer): void {
        if (!this.promptProvider) {
            return;
        }

        const prompts = this.promptProvider.list();
        for (const prompt of prompts) {
            const inputSchemaShape = (prompt.argumentSchema as z.AnyZodObject).shape;
            server.prompt(
                prompt.name,
                prompt.description,
                inputSchemaShape,
                async (args: z.infer<typeof prompt.argumentSchema>) => {
                    return await prompt.execute(args);
                }
            );
        }
    }

    private buildResources(server: McpServer): void {
        if (!this.resourceProvider) {
            return;
        }

        const resources = this.resourceProvider.list();
        for (const resource of resources) {
            server.resource(
                resource.name,
                resource.uri,
                {
                    name: resource.name,
                    description: resource.description,
                    mimeType: resource.mimeType,
                },
                async () => {
                    return await resource.execute();
                }
            );
        }
    }

    build(): McpServer {
        const server = this.buildServer();
        this.buildTools(server);
        this.buildPrompts(server);
        this.buildResources(server);
        return server;
    }
}
