const DEFAULT_INSTRUCTIONS = 'Generate a README for the following actor:';

// TODO: Fix this type
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const buildPrompt = (actorData: any) => {
    // TODO: Build prompt from actor data
    return `${DEFAULT_INSTRUCTIONS}
        ${actorData.description}
    `;
};
