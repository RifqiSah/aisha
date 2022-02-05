import axios from 'axios';
import { logger } from '../../../lib/logger';

const axiosClient = axios.create({
    timeout: 20000,
    headers: {

    },
});

axiosClient.interceptors.request.use((x) => {
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

axiosClient.interceptors.response.use((x) => {

    const printable = `[API] Response: ${x.status} | ${JSON.stringify(x.data)}`;
    logger.debug(printable);

    return x;
});

export default axiosClient;