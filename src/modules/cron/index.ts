import { readdirSync } from 'fs';
import { resolve } from 'path';

const disabledModule = [
    'example',
    'bdmnews',
    'dnkrnews',
    'dnseanews',
    'dntrack',
    'freeGames',
];

module.exports = (client: any) => {
    client.logger.info('  [-] Initialize cron');

    const crons = readdirSync(resolve(__dirname, './src/')).filter((f) => f.endsWith('.js') && !disabledModule.some((v) => f.includes(`${v}.js`)));
    for (const file of crons) {
        const cron = require(resolve(__dirname, `./src/${file}`));
        const key = file.slice(0, -3);

        cron.init(client);
        cron.handle.start();

        client.logger.info(`    + '${key}' added and started.`);
    }

    client.logger.info('  [V] Done!');
};
