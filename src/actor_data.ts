export const getActorData = async (actorId: string) => {
    return {
        _id: actorId,
        name: 'example-actor',
        title: 'Example Actor',
        description: 'Example Actor',
        version: '0.0',
        buildTag: 'latest',
    };
};
