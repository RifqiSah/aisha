const { ChannelModel } = require('../models');

module.exports = {
    async count() {
        return await ChannelModel.count();
    },

    async getAllChannel() {
        return await ChannelModel.findAll();
    },

    async getChannel(chId: string) {
        return ChannelModel.findOne({
            where: {
                channelId: chId,
            },
        });
    },

    async addChannel(gId: string, chId: string, name: string) {
        await ChannelModel.create({
            guildId: gId,
            channelId: chId,
            channelName: name,
        });
    },

    async deleteChannel(gId: string, chId: string) {
        await ChannelModel.destroy({
            where: {
                guildId: gId,
                channelId: chId,
            },
        });
    },

    async updateChannel(gId: string, chId: string, data: any) {
        await ChannelModel.update({

        }, {
            where: {
                guildId: gId,
                channelId: chId,
            },
        });
    },
};
