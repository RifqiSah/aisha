import { logger } from '../../lib/logger';
import { Channel } from '../models/channel.model';

module.exports = {
    count() {
        return Channel.countDocuments({});
    },

    getAllChannel() {
        Channel.find({}, (err, doc) => {
            if (err)  return logger.error(err);

            return doc;
        });
    },

    getChannel(chId: string) {
        return Channel.findOne({ channelId: chId });
    },

    addChannel(gId: string, chId: string, name: string) {
        const channel = new Channel({ guildId: gId, channelId: chId, channelName: name });
        channel.save((err: any, doc: any) => {
            if (err) return logger.error(err);
        });
    },

    deleteChannel(gId: string, chId: string) {
        Channel.findOneAndDelete({ guildId: gId, channelId: chId }, {}, (err: any, doc: any) => {
            if (err) return logger.error(err);
        });
    },

    updateChannel(gId: string, chId: string, data: any) {
        Channel.findOneAndUpdate({ guildId: gId, channelId: chId }, data, {}, (err: any, doc: any) => {
            if (err) return logger.error(err);
        });
    },
};
