import { Actor } from 'apify';

const requestOptions = {
    method: 'GET',
    headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${Actor.getEnv().token}`,
    },
};

export const fetchFromApify = async (url: string) => fetch(url, requestOptions).then((response) => response.json());
