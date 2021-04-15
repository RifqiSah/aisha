import { logger } from '../../lib/logger';
import { Guild } from '../models/guild.model';

module.exports = {
    count() {
        return Guild.countDocuments({});
    },

    addGuild(gId: string, gName: string) {
        const guild = new Guild({ guildId: gId, guildName: gName });
        guild.save((err: any, ch: any) => {
            if (err) return logger.error(err);

            // logger.info(`[DB]: ${gId} saved!`);
        });
    },

    getGuild(gId: string) {
        return Guild.findOne({ guildId: gId });
    },

    deleteGuild(gId: string) {
        Guild.findOneAndDelete({ guildId: gId }, (err: any, doc: any) => {
            if (err) return logger.error(err);

            // const msg = doc ? 'deleted!' : 'not found!';
            // logger.info(`[DB]: ${gId} ${msg}`);
        });
    },
};
