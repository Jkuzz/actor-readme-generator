type ActorDataPromptInput = {
    description: string;
    currentPricingInfo: unknown;
    inputSchema: unknown;
};

export const buildPrompt = (actorData: ActorDataPromptInput) => {
    // TODO: Build prompt from actor data

    const actorMoreData = {
        description: actorData.description,
        currentPricingInfo: actorData.currentPricingInfo,
    };

    return `Generate a README for an Apify Actor. Here is a summary of a guide on writing a good README.\n`
        // TODO: Add the guide summary here
        + `Here is the Actor's input schema:\n${
            JSON.stringify(actorData.inputSchema)
        }\nHere are some more details about the actor\n${
            JSON.stringify(actorMoreData)
        }`;
};
