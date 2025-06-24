import { FincodeAPIConfigService, McpServerBuilder } from '@fincode/mcp-core';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import { FincodeApiCreatePaymentUrlMcpPrompt } from './fincode/mcp/api/prompt/FincodeApiCreatePaymentUrlMcpPrompt.js';
import { FincodeApiCreatePaymentUrlMcpTool } from './fincode/mcp/api/tool/FincodeApiCreatePaymentUrlMcpTool.js';

async function main() {
    const apiConfigService = new FincodeAPIConfigService();
    const apiConfig = apiConfigService.fromEnv();
    const mcpServer = McpServerBuilder.builder()
        .server('fincode-mcp-api', '1.0.0')
        .tools(new FincodeApiCreatePaymentUrlMcpTool(apiConfig))
        .prompts(new FincodeApiCreatePaymentUrlMcpPrompt())
        .build();

    const transport = new StdioServerTransport();
    await mcpServer.connect(transport);
}

main().catch((error: unknown) => {
    const errorMessage = error instanceof Error ? error.message : String(error);
    console.error(errorMessage, error);
    process.exit(1);
});
