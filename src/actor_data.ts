import { Actor, type ApifyClient } from 'apify';

export const getActorPricingInfoEffectiveAtDate = ({
    pricingInfos,
    date,
}: {
    pricingInfos: any[],
    date: Date,
}): any | null => {
    if (!pricingInfos?.length) return null;

    const effectivePricingInfo = (pricingInfos
        .filter((pricingInfo) => pricingInfo.startedAt <= date)
        .sort((a, b) => b.startedAt.getTime() - a.startedAt.getTime())
    )[0] || null;

    return effectivePricingInfo;
};

export const getCurrentActorPricingInfo = (
    pricingInfos: unknown[],
) => (
    getActorPricingInfoEffectiveAtDate({ pricingInfos, date: new Date() })
);

const requestOptions = {
    method: 'GET',
    headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${Actor.getEnv().token}`,
    },
};

export const fetchActorDefaultBuild = async (actorId: string) => {
    const cleanedActorId = actorId.replace('/', '~');
    const res = await fetch(`https://api.apify.com/v2/acts/${cleanedActorId}/builds/default`, requestOptions).then((response) => response.json());

    return res.data;
};

export const getActorData = async (apifyClient: ApifyClient, actorId: string) => {
    const actorData = await apifyClient.actor(actorId).get();
    const latestBuildId = actorData?.taggedBuilds?.latest?.buildId;

    if (!latestBuildId) {
        throw new Error('You must build the Actor before generating the Readme');
    }
    const build = await fetchActorDefaultBuild(actorId);

    const { name, username, exampleRunInput, categories, title, seoTitle, seoDescription, pricingInfos } = actorData;
    // TODO: add an optional readme in the future
    const { inputSchema } = build;

    return {
        name,
        username,
        exampleRunInput,
        categories,
        title,
        seoTitle,
        seoDescription,
        currentPricingInfo: getCurrentActorPricingInfo(pricingInfos),
        inputSchema,
    };
};
