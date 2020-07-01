import { Guild } from '../models/guild.model';

module.exports = {
    addGuild(gId: string, gName: string) {
        const guild = new Guild({ guildId: gId, guildName: gName });
        guild.save((e, ch) => {
            if (e) return console.log(e);

            console.log(`[DB]: ${gId} saved!`);
        });
    },

    deleteGuild(gId: string) {
        Guild.findOneAndDelete({ guildId: gId }, (e, deleted) => {
            if (e) return console.log(e);

            const msg = deleted ? 'deleted!' : 'not found!';
            console.log(`[DB]: ${gId} ${msg}`);
        });
    },
};
