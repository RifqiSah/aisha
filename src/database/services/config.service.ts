const { ConfigModel } = require('../models');

module.exports = {
    async count() {
        return await ConfigModel.count();
    },

    async getAllConfig() {
        return await ConfigModel.findAll();
    },

    async getConfig(gId: string, key: string) {
        return await ConfigModel.findOne({
            where: {
                guildId: gId,
                key: key,
            },
        });
    },

    async addConfig(gId: string, key: string, value: string, desc: string) {
        await ConfigModel.create({
            guildId: gId,
            key: key,
            value: value,
            desc: desc,
        });
    },

    async deleteConfig(gId: string, key: string) {
        await ConfigModel.destroy({
            where: {
                guildId: gId,
                key: key,
            },
        });
    },

    async updateConfig(gId: string, key: string, value: any) {
        await ConfigModel.update({

        }, {
            where: {
                guildId: gId,
                key: key,
            },
        });
    },
};
