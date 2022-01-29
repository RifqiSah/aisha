const { GameServer } = require('../models/alriftech');

module.exports = {
    async count() {
        return await GameServer.count();
    },

    async getAllGameServer(opt: any = {}) {
        return await GameServer.findAll(opt);
    },

    async getGameServer(key: string) {
        return await GameServer.findOne({
            where: {
                key: key,
            },
        });
    },

    async addGameServer(key: string, value: string) {
        await GameServer.create({
            key: key,
            value: value,
        });
    },

    async deleteGameServer(key: string) {
        await GameServer.destroy({
            where: {
                key: key,
            },
        });
    },

    async updateGameServer(key: string, value: any) {
        await GameServer.update({
            value,
        }, {
            where: {
                key: key,
            },
        });
    },
};
