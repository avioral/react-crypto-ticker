export const BASE_URL = 'https://min-api.cryptocompare.com/data';
export const SOCKET_URL = (apiKey)  => {
    return `wss://streamer.cryptocompare.com/v2?api_key=${apiKey}`
}
export const CURRENCIES_DATA = `${BASE_URL}/coin/generalinfo`;
export const CURRENCY_DATA = `${BASE_URL}/v2/subs`;
export const HISTORICAL_DATA = `${BASE_URL}/v2/histoday`;
export const CURRENCY_PRICE = `${BASE_URL}/price`;

