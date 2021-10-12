import config from './config';
import { logger } from '../lib/logger';

const db = require('../database/models');

// Connect
export default class Database {
    // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
    static async connect(force: boolean) {
        if (force) {
            db.adapter.sync({ force: true }).then(() => {
                logger.warn('Drop and re-sync db.');
            });
        } else {
            await db.adapter.sync();
            logger.warn('Re-sync db.');
        }
        logger.info('[V] Database connected!');
    }
}