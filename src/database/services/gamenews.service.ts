const { GameNews } = require('../models/alriftech');

module.exports = {
    async count() {
        return await GameNews.count();
    },

    async findAll(opt: any = {}) {
        return await GameNews.findAll(opt);
    },

    async findOne(where: any = {}) {
        return await GameNews.findOne({
            where: where,
        });
    },

    async create(key: string, value: string) {
        await GameNews.create({
            key: key,
            value: value,
        });
    },

    async destroy(key: string) {
        await GameNews.destroy({
            where: {
                key: key,
            },
        });
    },

    async update(where: any, value: any) {
        await GameNews.update(value, {
            where: where,
        });
    },
};
