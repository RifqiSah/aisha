import func from '../../lib/function';

import { logger } from '../../lib/logger';
import { Point } from '../models/point.model';

module.exports = {
    async total(uId: string) {
        return await Point.aggregate([
            {
                $match: {
                    userId: uId
                } },
            {
                $group: {
                    _id: null,
                    total: { $sum: '$point' }
                }
            }
        ]);
    },

    addPoint(uId: string, uPoint: number) {
        const now = func.getDate();
        const point = new Point({ userId: uId, point: uPoint, date: now });

        point.save((e, ch) => {
            if (e) {
                return logger.error(e);
            }

            logger.info(`[DB]: ${uId} with ${uPoint} saved!`);
        });
    },
};
