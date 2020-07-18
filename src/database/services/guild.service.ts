import { logger } from '../../lib/logger';
import { Guild } from '../models/guild.model';

module.exports = {
    count() {
        return Guild.countDocuments({});
    },

    addGuild(gId: string, gName: string) {
        const guild = new Guild({ guildId: gId, guildName: gName });
        guild.save((e, ch) => {
            if (e) {
                return logger.error(e);
            }

            logger.info(`[DB]: ${gId} saved!`);
        });
    },

    deleteGuild(gId: string) {
        Guild.findOneAndDelete({ guildId: gId }, (e, deleted) => {
            if (e) {
                return logger.error(e);
            }

            const msg = deleted ? 'deleted!' : 'not found!';
            logger.info(`[DB]: ${gId} ${msg}`);
        });
    },
};
