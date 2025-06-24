import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { FincodeAPIDocsSearchService, McpServerBuilder } from '@fincode/mcp-core';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import { FincodeDocsCreatePaymentUrlCodingMcpPrompt } from './fincode/mcp/docs/prompt/FincodeDocsCreatePaymentUrlCodingMcpPrompt.js';
import { FincodeDocsCreatePaymentUrlMcpResource } from './fincode/mcp/docs/resource/FincodeDocsCreatePaymentUrlMcpResource.js';
import { FincodeDocsCreatePaymentUrlMcpTool } from './fincode/mcp/docs/tool/FincodeDocsCreatePaymentUrlMcpTool.js';

async function main() {
    const yamlFilePath = path.join(
        path.dirname(fileURLToPath(import.meta.url)),
        'fincode-openapi.yml'
    );
    const docsSearchService = new FincodeAPIDocsSearchService(yamlFilePath);
    const mcpServer = McpServerBuilder.builder()
        .server('fincode-mcp-docs', '1.0.0')
        .tools(new FincodeDocsCreatePaymentUrlMcpTool(docsSearchService))
        .prompts(new FincodeDocsCreatePaymentUrlCodingMcpPrompt())
        .resources(new FincodeDocsCreatePaymentUrlMcpResource(docsSearchService))
        .build();
    const transport = new StdioServerTransport();
    await mcpServer.connect(transport);
}

main().catch((error: unknown) => {
    const errorMessage = error instanceof Error ? error.message : String(error);
    console.error(errorMessage, error);
    process.exit(1);
});
