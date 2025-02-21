import { type ApifyClient } from 'apify';
import { fetchFromApify } from './fetch_from_apify.js';

export const getActorPricingInfoEffectiveAtDate = ({
    pricingInfos,
    date,
}: {
    // TODO: Optionally add this code from core repository
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    pricingInfos: any[],
    date: Date,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
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

export const fetchActorDefaultBuild = async (actorId: string) => {
    const cleanedActorId = actorId.replace('/', '~');
    const res = await fetchFromApify(`https://api.apify.com/v2/acts/${cleanedActorId}/builds/default`);
    return res.data;
};

export const getActorData = async (apifyClient: ApifyClient, actorId: string) => {
    const actorData = await apifyClient.actor(actorId).get();
    const latestBuildId = actorData?.taggedBuilds?.latest?.buildId;

    if (!latestBuildId) {
        throw new Error('You must build the Actor before generating the Readme');
    }
    const build = await fetchActorDefaultBuild(actorId);

    const {
        // eslint-disable-next-line
        // @ts-ignore pricingInfos are there, just missing on the type
        name, username, exampleRunInput, categories, title, seoTitle, seoDescription, pricingInfos,
    } = actorData;
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
