import func from '../../lib/function';
const { PointModel } = require('../models');

module.exports = {
    async getPoint(uId: string) {
        return await PointModel.findOne({
            where: {
                userId: uId,
            },
        });
    },

    async addPoint(uId: string, uPoint: number) {
        await new Promise((resolve) => setTimeout(resolve, 100));

        const now = func.getDate();
        const row = await PointModel.findOne({
            where: {
                userId: uId,
            },
        });
        if (!row) {
            return await PointModel.create({
                userId: uId,
                point: uPoint,
                updated: now,
            });
        }

        await row.increment('point', { by: uPoint });
    },

    async deletePoint(uId: string) {
        await PointModel.destroy({
            where: {
                userId: uId,
            },
        });
    },

    async rank(uId: string) {
        return await PointModel.findAll({
            order: [
                ['point', 'ASC'],
            ],
        });
    }
};
