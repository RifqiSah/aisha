import axios from 'axios';
import { logger } from '../../../lib/logger';

const trimString = function (string: string, length: number) {
    return string.length > length ? string.substring(0, length) + '...' : string;
};

const axiosClient = axios.create({
    timeout: 20000,
    headers: {

    },
});

axiosClient.interceptors.request.use((x: any) => {
    const headers = {
        ...x.headers,
    };

    ['common', 'get', 'post', 'head', 'put', 'patch', 'delete'].forEach((header) => {
        delete headers[header];
    });

    const printable = `[API] Request: ${x?.method?.toUpperCase()} | ${x.url} | ${JSON.stringify(x.data)} | ${JSON.stringify(headers)}`;
    logger.debug(printable);

    return x;
});

axiosClient.interceptors.response.use((x: any) => {

    const printable = `[API] Response: ${x.status} | ${trimString(JSON.stringify(x.data), 100)}`;
    logger.debug(printable);

    return x;
});

export default axiosClient;