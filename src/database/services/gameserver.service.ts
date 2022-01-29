const { GameServer } = require('../models/alriftech');

module.exports = {
    async count() {
        return await GameServer.count();
    },

    async findAll(opt: any = {}) {
        return await GameServer.findAll(opt);
    },

    async findOne(key: string) {
        return await GameServer.findOne({
            where: {
                key: key,
            },
        });
    },

    async create(key: string, value: string) {
        await GameServer.create({
            key: key,
            value: value,
        });
    },

    async destroy(key: string) {
        await GameServer.destroy({
            where: {
                key: key,
            },
        });
    },

    async update(where: any, value: any) {
        await GameServer.update(value, {
            where: where,
        });
    },
};
