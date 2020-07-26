import func from '../../lib/function';

import { logger } from '../../lib/logger';
import { Point } from '../models/point.model';

module.exports = {
    getPoint(uId: string) {
        return Point.findOne({ userId: uId });
    },

    async addPoint(uId: string, uPoint: number) {
        await new Promise((resolve) => setTimeout(resolve, 100));

        const now = func.getDate();
        const row = await Point.findOne({ userId: uId });
        if (!row) {
            return await new Point({ userId: uId, point: uPoint, updated: now }).save((err, doc) => {
                if (err) return logger.error(err);
    
                // logger.info(`[DB]: ${uId} saved!`);
            });
        }

        Point.findOneAndUpdate({ userId: uId }, {
            $inc: { point: uPoint },
            updated: now
        },{
            new: true
        }, (err, doc) => {
            if (err) return logger.error(err);

            // const msg = doc ? 'saved!' : 'not found!';
            // logger.info(`[DB]: ${uId} with ${uPoint} ${msg}`);
        });
    },

    deletePoint(uId: string) {
        Point.findOneAndDelete({ userId: uId }, (err, doc) => {
            if (err) return logger.error(err);

            // const msg = doc ? 'deleted!' : 'not found!';
            // logger.info(`[DB]: ${uId} ${msg}`);
        });
    },

    async rank(uId: string) {
        return Point.find({}).sort({ point: -1 }).cursor();
    }
};
