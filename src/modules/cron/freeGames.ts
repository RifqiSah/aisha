import cron from 'node-cron';

const getData = () => {
    console.log('Hahaha!');
};

export const handle = cron.schedule('* * * * *', () => {
    getData();
});