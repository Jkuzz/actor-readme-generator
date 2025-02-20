import type { ApifyClient } from 'apify';

export const getActorData = async (apifyClient: ApifyClient, actorId: string) => {
    const actorData = await apifyClient.actor(actorId).get();
    const latestBuildId = actorData?.taggedBuilds?.latest?.buildId;

    if (!latestBuildId) {
        throw new Error('You must build the Actor before generating the Readme');
    }
    const build = await apifyClient
        .build(latestBuildId)
        .get();

    return {
        actorData,
        build,
    };
};
