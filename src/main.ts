import { Actor, log } from 'apify';
import { BeeAgent } from 'bee-agent-framework/agents/bee/agent';
import { UnconstrainedMemory } from 'bee-agent-framework/memory/unconstrainedMemory';
import { z } from 'zod';
import { LangChainChatModel } from 'bee-agent-framework/adapters/langchain/backend/chat';
import { ChatOpenAI } from '@langchain/openai';
import { OpenAIChatModel } from 'bee-agent-framework/adapters/openai/backend/chat';
import { CalculatorSumTool } from './tools/calculator.js';
import { InstagramScrapeTool } from './tools/instagram.js';
import { StructuredOutputGenerator } from './structured_response_generator.js';
import { beeOutputTotalTokens, chargeForActorStart, chargeForModelTokens } from './ppe_utils.js';
import { getActorData } from './actor_data.js';

// Actor input schema
interface Input {
    actorId: string;
    modelName: string;
    debug?: boolean;
}

const query = 'Generate a README for the following actor:';
await Actor.init();

/**
 * Actor code
*/
await chargeForActorStart();

// Handle input
const {
    actorId,
    modelName = 'gpt-4o-mini',
    debug,
} = await Actor.getInput() as Input;
if (debug) {
    log.setLevel(log.LEVELS.DEBUG);
}

const actorData = await getActorData(actorId);
console.log('🚀 ~ actorData:', actorData);

// Create a ReAct agent that can use tools.
// See https://i-am-bee.github.io/bee-agent-framework/#/agents?id=bee-agent
// In order to use PPE, the LangChain adapter must be used
// otherwise, the token usage is not tracked.
log.debug(`Using model: ${modelName}`);
const llm = new LangChainChatModel(
    new ChatOpenAI({ model: modelName }),
);

// The LangChain adapter does not work with the structured output generation
// for some reason.
// Create a separate LLM for structured output generation.
const llmStructured = new OpenAIChatModel(modelName);
const agent = new BeeAgent({
    llm,
    memory: new UnconstrainedMemory(),
    tools: [new CalculatorSumTool(),
        new InstagramScrapeTool()],
});

// Store tool messages for later structured output generation.
// This can be removed if you don't need structured output.
const structuredOutputGenerator = new StructuredOutputGenerator(llmStructured);

// Prompt the agent with the query.
// Debug log agent status updates, e.g., thoughts, tool calls, etc.
const response = await agent
    .run({ prompt: query })
    .observe((emitter) => {
        emitter.on('update', async ({ update }) => {
            log.debug(`Agent (${update.key}) 🤖 : ${update.value}`);

            // Save tool messages for later structured output generation.
            // This can be removed if you don't need structured output.
            if (['tool_name', 'tool_output', 'tool_input'].includes(update.key as string)) {
                structuredOutputGenerator.processToolMessage(
                    update.key as 'tool_name' | 'tool_output' | 'tool_input',
                    update.value,
                );
            }
            // End of tool message saving.
        });
    });

const tokensTotal = beeOutputTotalTokens(response);
await chargeForModelTokens(modelName, tokensTotal);

log.info(`Agent 🤖 : ${response.result.text}`);

// Hacky way to get the structured output.
// Using the stored tool messages and the user query to create a structured output.
const structuredResponse = await structuredOutputGenerator.generateStructuredOutput(query,
    z.object({
        totalLikes: z.number(),
        totalComments: z.number(),
        mostPopularPosts: z.array(z.object({
            url: z.string(),
            likes: z.number(),
            comments: z.number(),
            timestamp: z.string(),
            caption: z.string().nullable().optional(),
            alt: z.string().nullable().optional(),
        })),
    }));
log.debug(`Structured response: ${JSON.stringify(structuredResponse)}`);
// Since the token usage tracking does not work with the Bee LLM, we will
// just charge the same amount of tokens as the total tokens used by the agent for the
// structured output generation - which is mostly the tool calls passed to the structured output generator.
await chargeForModelTokens(modelName, tokensTotal);
// End of structured output generation.

// Push results to the dataset.
await Actor.pushData({
    query,
    response: response.result.text,
    // This can be removed if you don't need structured output.
    structuredResponse: structuredResponse.object,
});
log.info('Pushed the data into the dataset!');

await Actor.exit();
