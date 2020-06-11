import mongoose from 'mongoose';
import config from './config';

mongoose.Promise = global.Promise;

// Cek apakah envnya ada atau tidak
if (!config.MONGODB) {
    console.log('[X] DB configuration error!');
    process.exit();
}

// Connect
export default class Database {
    static connect(): void {
        mongoose.connect(`${config.MONGODB}`, { useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: false })
            .then(() => {
                console.log('[V] Database connected!');
            }).catch((err: any) => {
                console.log(`[X] Database error with: ${err}!`);
                process.exit();
            });
    }
}
