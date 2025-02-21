import { ApifyClient, log } from 'apify';
import { Emitter } from 'bee-agent-framework/emitter/emitter';
import { AnyToolSchemaLike } from 'bee-agent-framework/internals/helpers/schema';
import { JSONToolOutput, Tool, ToolEmitter, ToolInput, ToolInputValidationError } from 'bee-agent-framework/tools/base';
import { z } from 'zod';
import { LLMTool } from 'bee-agent-framework/tools/llm';
import { ChatOpenAI } from '@langchain/openai';
import { LangChainChatModel } from 'bee-agent-framework/adapters/langchain/backend/chat';

interface CodeSummariserToolOutput {
    code: string;
}

export class CodeSummariserTool extends Tool<JSONToolOutput<CodeSummariserToolOutput>> {
    override name: string = 'summarise-code';
    override description: string = 'Summarises the source code files of the provided actor';

    private apifyClient: ApifyClient;
    private modelName: string;

    override inputSchema(): Promise<AnyToolSchemaLike> | AnyToolSchemaLike {
        return z.object({
            actorId: z.string().describe('The ID of the actor to summarise the code for.'),
        });
    }

    constructor(apifyClient: ApifyClient, modelName: string) {
        super();
        this.apifyClient = apifyClient;
        this.modelName = modelName;
    }

    public readonly emitter: ToolEmitter<ToolInput<this>, JSONToolOutput<CodeSummariserToolOutput>> = Emitter.root.child({
        namespace: ['tool', 'summarise_code'],
        creator: this,
    });

    protected async _run(input: ToolInput<this>): Promise<JSONToolOutput<CodeSummariserToolOutput>> {
        const { actorId } = input;
        log.debug(`🤖 Summarising code for ${actorId}`);
        if (!actorId || !actorId.trim()) {
            throw new ToolInputValidationError('You must provide an Apify Actor ID.');
        }
        const actorData = await this.apifyClient.actor(actorId).get();
        if (!actorData || !actorData.versions?.length) {
            throw new ToolInputValidationError(`Actor's source code is not available.`);
        }
        const latestVersion = actorData.versions.find((version) => version.buildTag === 'latest') ?? actorData.versions[actorData.versions.length - 1];
        if (!('sourceFiles' in latestVersion)) {
            throw new ToolInputValidationError(`Actor's source code files are not available.`);
        }

        log.debug(`Fetching code for ${actorData.name}`);
        const chatOpenAI = new ChatOpenAI({
            modelName: this.modelName,
        });
        const tool = new LLMTool({ llm: new LangChainChatModel(chatOpenAI) });

        const mainFile = latestVersion.sourceFiles.find((file) => file.name.includes('main.'));
        if (!mainFile) {
            throw new ToolInputValidationError(`Actor's main file could not be found.`);
        }

        const prompt = `Summarise the source code of the Apify Actor ${actorData.name}. Focus on what the Actor achieves, what it needs and what it outputs.
        This summary will be used to generate a README. The source code for its main function follows:
        ${mainFile.content}`;

        const response = await tool.run({
            task: prompt,
        });

        log.debug(`🤖 Summarised code for ${actorData.name}: ${response.result}`);
        // TODO: Charge for the tokens used
        return new JSONToolOutput({ code: response.result });
    }

    static {
        // Makes the class serializable
        this.register();
    }
}
