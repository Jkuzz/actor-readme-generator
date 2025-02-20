import { log } from 'apify';
import { Emitter } from 'bee-agent-framework/emitter/emitter';
import { AnyToolSchemaLike } from 'bee-agent-framework/internals/helpers/schema';
import { JSONToolOutput, Tool, ToolEmitter, ToolInput, ToolInputValidationError } from 'bee-agent-framework/tools/base';
import { z } from 'zod';

interface EvaluateReadmeToolOutput {
    evaluation: string;
    // TODO: suggestions
}
/**
 * @class CalculatorSumTool
 * @extends Tool
 *
 * @description
 */
export class EvaluateReadmeTool extends Tool<JSONToolOutput<EvaluateReadmeToolOutput>> {
    override name: string = 'evaluate-readme';

    override description: string = 'Evaluates the README of the provided actor';

    override inputSchema(): Promise<AnyToolSchemaLike> | AnyToolSchemaLike {
        return z.object({
            readme: z.string().describe('The README to evaluate in markdown format.'),
        });
    }

    public readonly emitter: ToolEmitter<ToolInput<this>, JSONToolOutput<EvaluateReadmeToolOutput>> = Emitter.root.child({
        namespace: ['tool', 'evaluate_readme'],
        creator: this,
    });

    private async evaluateReadme(readme: string): Promise<string> {
        log.debug(`Evaluating README ${readme.length}`);
        return `Looks good!`;
    }

    protected async _run(input: ToolInput<this>): Promise<JSONToolOutput<EvaluateReadmeToolOutput>> {
        const { readme } = input;
        if (!readme) {
            throw new ToolInputValidationError('You must provide a README to evaluate.');
        }
        const evaluation = await this.evaluateReadme(readme);
        return new JSONToolOutput({ evaluation });
    }

    static {
        // Makes the class serializable
        this.register();
    }
}
