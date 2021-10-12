const { GuildModel } = require('../models');

module.exports = {
    async count() {
        return await GuildModel.count();
    },

    async addGuild(gId: string, gName: string) {
        await GuildModel.create({
            guildId: gId,
            guildName: gName,
        });
    },

    async getGuild(gId: string) {
        return await GuildModel.findOne({
            where: {
                guildId: gId,
            },
        });
    },

    async deleteGuild(gId: string) {
        await GuildModel.destroy({
            where: {
                guildId: gId,
            },
        });
    },
};
