import { log } from 'apify';
import { Emitter } from 'bee-agent-framework/emitter/emitter';
import { AnyToolSchemaLike } from 'bee-agent-framework/internals/helpers/schema';
import { JSONToolOutput, Tool, ToolEmitter, ToolInput, ToolInputValidationError } from 'bee-agent-framework/tools/base';
import { z } from 'zod';
import { fetchActorDefaultBuild } from '../actor_data.js';

interface GetReadmeToolOutput {
    readme: string;
}
/**
 * @class CalculatorSumTool
 * @extends Tool
 *
 * @description
 * This class represents a tool for calculating the sum of a list of numbers.
 * It extends the base Tool class and provides a specific implementation for
 * summing numbers.
 */
export class GetReadmeTool extends Tool<JSONToolOutput<GetReadmeToolOutput>> {
    override name: string = 'get-readme';

    override description: string = 'Fetches the README of the provided actor';

    override inputSchema(): Promise<AnyToolSchemaLike> | AnyToolSchemaLike {
        return z.object({
            actorFullName: z.string().describe('The full name of the actor to fetch the README for. In the format username/actor-name.'),
        });
    }

    public readonly emitter: ToolEmitter<ToolInput<this>, JSONToolOutput<GetReadmeToolOutput>> = Emitter.root.child({
        namespace: ['tool', 'get_readme'],
        creator: this,
    });

    private async fetchReadme(actorFullName: string): Promise<string> {
        log.debug(`Fetching README for ${actorFullName}`);
        const defaultBuild = await fetchActorDefaultBuild(actorFullName);
        if (`${defaultBuild?.userId}/${defaultBuild?.actorId}` === actorFullName) {
            return 'No README found';
        }
        return defaultBuild.readme ?? 'No README found';
    }

    protected async _run(input: ToolInput<this>): Promise<JSONToolOutput<GetReadmeToolOutput>> {
        const { actorFullName } = input;
        if (!actorFullName || !actorFullName.trim() || !actorFullName.includes('/')) {
            throw new ToolInputValidationError('You must provide an actor full name in the format username/actor-name.');
        }
        const readme = await this.fetchReadme(actorFullName);
        return new JSONToolOutput({ readme });
    }

    static {
        // Makes the class serializable
        this.register();
    }
}
