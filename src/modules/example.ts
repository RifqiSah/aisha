import cron from 'node-cron';

let _client: any = null;

const getData = () => {
    _client.logger.debug('[CRON] Example ticked!');
};

exports.init = (client: any) => {
    _client = client;
};

export const handle = cron.schedule('* * * * *', () => {
    getData();
});