module.exports = {
    name: 'channel',
    func: async (client: any, message: any, args: any) => {
        const chid = message.channel.id;
        const guildid = message.guild.id;
        const chname = client.bot.channels.cache.get(chid).name;
        const status: boolean = args[1] === 'enable';
        
        if (!args[1]) {
            return message.channel.send('Mohon masukkan status!').then((msg: any) => msg.delete({ timeout: 5000 })).catch((err: any) => {
                client.logger.error(err);
            });
        }
        
        if (status) {
            client.chsvc.deleteChannel(guildid, chid, chname);
        } else {
            client.chsvc.addChannel(guildid, chid, chname);
        }
        
        return message.channel.send(`Channel <#${chid}> telah ${status ? 'diaktifkan' : 'dimatikan'}!`).then((msg: any) => msg.delete({ timeout: 5000 })).catch((err: any) => {
            client.logger.error(err);
        });
    }
};