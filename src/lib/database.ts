import func from '../lib/function';
import { logger } from '../lib/logger';

// Connect
export default class Database {
    // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
    static async connect(force: boolean) {
        logger.info('[-] Initialize database');
        await Promise.all(func.getDirs('database/models').map(async (x) => {
            const db = require(`../database/models/${x}/index.js`);
            if (force) {
                db.adapter.sync({ force: true }).then(() => {
                    logger.warn(` [V] Drop and re-sync \`${x}\` db.`);
                });
            } else {
                await db.adapter.sync();
                logger.warn(` [V] Re-sync \`${x}\` db.`);
            }
        }));

        logger.info('[V] Database connected!');
    }
}