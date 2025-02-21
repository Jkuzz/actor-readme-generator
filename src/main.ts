import { Actor, ApifyClient, log } from 'apify';
import { BeeAgent } from 'bee-agent-framework/agents/bee/agent';
import { UnconstrainedMemory } from 'bee-agent-framework/memory/unconstrainedMemory';
import { LangChainChatModel } from 'bee-agent-framework/adapters/langchain/backend/chat';
import { ChatOpenAI } from '@langchain/openai';
import { beeOutputTotalTokens, chargeForActorStart, chargeForModelTokens } from './ppe_utils.js';
import { getActorData } from './actor_data.js';
import { buildPrompt } from './prompt_builder.js';
import { GetReadmeTool } from './tools/readme_fetcher.js';
import { getDatasetInformation } from './actor_dataset.js';

/**
 * Actor input schema
 */
interface Input {
    actorId: string;
    modelName?: string;
    debug?: boolean;
}

await Actor.init();

/**
 * Actor code
*/
await chargeForActorStart();

const userToken = Actor.getEnv().token;
if (!userToken) {
    throw new Error('User token is required.');
}

// Handle input
const {
    actorId,
    modelName = 'gpt-4o-mini',
    debug,
} = await Actor.getInput() as Input;
if (debug) {
    log.setLevel(log.LEVELS.DEBUG);
}
if (!actorId) {
    throw new Error('Actor ID is required.');
}

const apifyClient = new ApifyClient({
    token: userToken,
});

const actorData = await getActorData(apifyClient, actorId);
const datasetData = await getDatasetInformation(actorId);
const prompt = buildPrompt(actorData, datasetData);

// Create a ReAct agent that can use tools.
// See https://i-am-bee.github.io/bee-agent-framework/#/agents?id=bee-agent
// In order to use PPE, the LangChain adapter must be used
// otherwise, the token usage is not tracked.
log.debug(`Using model: ${modelName}`);
const llm = new LangChainChatModel(
    new ChatOpenAI({ model: modelName }),
);

const agent = new BeeAgent({
    llm,
    memory: new UnconstrainedMemory(),
    tools: [
        new GetReadmeTool(),
    ],
});

const response = await agent.run({ prompt });
const tokensTotal = beeOutputTotalTokens(response);
await chargeForModelTokens(modelName, tokensTotal);

log.info(`Agent 🤖 : ${response.result.text}`);

// Since the token usage tracking does not work with the Bee LLM, we will
// just charge the same amount of tokens as the total tokens used by the agent for the
// structured output generation - which is mostly the tool calls passed to the structured output generator.
await chargeForModelTokens(modelName, tokensTotal);

await Actor.pushData({
    readme: response.result.text,
});
log.info('Pushed the data into the dataset!');

await Actor.exit();
