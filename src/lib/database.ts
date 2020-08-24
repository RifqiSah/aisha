import mongoose from 'mongoose';
import config from './config';
import { logger } from '../lib/logger';

mongoose.Promise = global.Promise;

// Cek apakah envnya ada atau tidak
if (!config.MONGODB) {
    logger.error('[X] DB configuration error!');
    process.exit();
}

// Connect
export default class Database {
    // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
    static async connect() {
        mongoose.connect(`${config.MONGODB}`, { useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: false })
            .then(() => {
                logger.info('[V] Database connected!');
            }).catch((err: any) => {
                logger.error(`[X] Database error with: ${err}!`);
                process.exit();
            });
    }
}
