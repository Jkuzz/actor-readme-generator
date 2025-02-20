import type { ApifyClient } from 'apify';

export const getActorData = async (apifyClient: ApifyClient, actorId: string) => {
    const result = await apifyClient.actor(actorId).get();
    console.log(result);
    return {
        _id: actorId,
        name: 'example-actor',
        title: 'Example Actor',
        description: 'Example Actor',
        version: '0.0',
        buildTag: 'latest',
    };
};
