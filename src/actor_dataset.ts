import { fetchFromApify } from './fetch_from_apify.js';

const getLastSuccessfulRuns = async (actorId: string): Promise<{ id: string, defaultDatasetId: string }[]> => {
    const result = await fetchFromApify(`https://api.apify.com/v2/acts/${actorId}/runs?limit=50&desc=1`);
    const successfulRuns = result.data.items.filter((run) => run.status === 'SUCCEEDED');
    const latest5SuccessfulRuns = successfulRuns.slice(0, 5);

    return latest5SuccessfulRuns.map((run) => ({ id: run.id, defaultDatasetId: run.defaultDatasetId }));
};

export const getDatasetInformation = async (actorId: string): Promise<string[]> => {
    const latestSuccessfulRuns = await getLastSuccessfulRuns(actorId);

    const latestDatasetKeys = await Promise.all(
        latestSuccessfulRuns.map((run) => fetchFromApify(`https://api.apify.com/v2/datasets/${run.defaultDatasetId}/items`)),
    ).then((datasetsItems) => {
        const keys = datasetsItems.map((datasetItems) => {
            // Get all keys from one run dataset into a single array
            const keysForEveryRun = datasetItems.map((datasetItem) => Object.keys(datasetItem));
            return keysForEveryRun.flat();
        });
        // Create an array with all keys from all runs
        const flatKeys = keys.flat();
        // Make them unique
        return Array.from(new Set(flatKeys));
    });

    return latestDatasetKeys;
};
