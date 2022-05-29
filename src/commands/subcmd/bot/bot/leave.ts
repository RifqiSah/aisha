import { sendAndDelete } from '../../../../helpers/bot';

module.exports = {
    name: 'leave',
    func: async (client: any, message: any, args: any) => {
        args.shift();

        const guildIds: string[] = args;
        let counts = 0;

        if (!guildIds.length) {
            return sendAndDelete(message, 'Mohon masukkan minimal 1 Guild ID!', 5000);
        }

        guildIds.forEach((id: string) => {
            const guildObj = client.bot.guilds.cache.get(id);
            if (guildObj) {
                guildObj.leave().catch((err: any) => {
                    return client.logger.error(err);
                });

                counts++;
            }
        });

        return sendAndDelete(message, `Aisha telah keluar dari ${counts} - ${guildIds.length} guild!`, 5000);
    }
};