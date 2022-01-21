import { readdirSync } from 'fs';
import { resolve } from 'path';
import { handle } from './freeGames';

handle.start();

module.exports = (client: any) => {
    client.logger.info('  [-] Initialize cron');

    const crons = readdirSync(resolve(__dirname, './')).filter((f) => f.endsWith('.js') && !f.includes('index.js'));
    for (const file of crons) {
        const cron = require(resolve(__dirname, `./${file}`));
        const key = file.slice(0, -3);

        cron.handle.start();

        client.logger.info(`    + '${key}' added and started.`);
    }

    client.logger.info('  [V] Done!');
};
