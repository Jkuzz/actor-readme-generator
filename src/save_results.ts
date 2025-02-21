import { Actor, KeyValueStore, log } from 'apify';

export const saveResultToDataset = async (data: string) => {
    await Actor.pushData({
        readme: data,
    });
    log.info('Pushed the data into the dataset!');
};

export const saveResultToKeyValueStore = async (data: string) => {
    await KeyValueStore.setValue('readme-generator-run', data, { contentType: 'text/markdown' });
    log.info('Pushed the README.md file into the key-value store!');
};
