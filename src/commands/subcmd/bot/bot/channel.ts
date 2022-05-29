import { sendAndDelete } from '../../../../helpers/bot';

module.exports = {
    name: 'channel',
    func: async (client: any, message: any, args: any) => {
        const chid = message.channel.id;
        const guildid = message.guild.id;
        const chname = client.bot.channels.cache.get(chid).name;
        const status: boolean = args[1] === 'enable';

        if (!args[1]) {
            return sendAndDelete(message, 'Mohon masukkan status!', 5000);
        }

        if (status) {
            client.chsvc.deleteChannel(guildid, chid, chname);
        } else {
            client.chsvc.addChannel(guildid, chid, chname);
        }

        return sendAndDelete(message, `Channel <#${chid}> telah ${status ? 'diaktifkan' : 'dimatikan'}!`, 5000);
    }
};