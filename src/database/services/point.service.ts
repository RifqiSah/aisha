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
            return new Point({ userId: uId, point: uPoint, updated: now }).save((err: any, doc: any) => {
                if (err) return logger.error(err);
            });
        }

        Point.findOneAndUpdate({ userId: uId }, {
            $inc: { point: uPoint },
            updated: now
        },{
            new: true
        }, (err: any, doc: any) => {
            if (err) return logger.error(err);
        });
    },

    deletePoint(uId: string) {
        Point.findOneAndDelete({ userId: uId }, {}, (err: any, doc: any) => {
            if (err) return logger.error(err);
        });
    },

    async rank(uId: string) {
        return Point.find({}).sort({ point: -1 }).cursor();
    }
};
