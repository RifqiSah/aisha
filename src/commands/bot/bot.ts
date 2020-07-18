module.exports = {
    name: 'bot',
    desc: 'Control panel untuk BOT.\nPengaturan yang tersedia yaitu: ```- dch (Disable channel)\n- ech (Enable channel)```',
    enable: true,
    regex: false,
    help: false,
    role: ['372915947478056960'],
    aliases: [],
    usage: '[sub command] [status]',
    cooldown: 0,
    func: async (client: any, message: any, args: any) => {
        message.delete();

        if (!args.length) {
            return message.channel.send('Harap masukkan parameter!').then((msg: any) => msg.delete({ timeout: 5000 })).catch((err: any) => {
                client.logger.error(err);
            });
        }

        const data = [];
        const chid = message.channel.id;
        const guildid = message.guild.id;
        const chname = client.bot.channels.cache.get(chid).name;
        
        const gcount = await client.guildsvc.count();
        const chcount = await client.chsvc.count();

        switch (args[0]) {
            case 'dch':
                client.chsvc.addChannel(guildid, chid, chname);
                data.push(`Channel <#${chid}> telah dimatikan!`);
                break;

            case 'ech':
                client.chsvc.deleteChannel(guildid, chid, chname);
                data.push(`Channel <#${chid}> telah diaktifkan`);
                break;
            
            case 'gcount':
                data.push(`Aisha telah masuk kedalam \`${gcount}\` guild!`);
                break;

            case 'chcount':
                data.push(`Aisha telah masuk kedalam \`${chcount}\` channel!`);
                break;

            default:
                data.push(`Pengaturan untuk \`${args[0]}\` tidak ditemukan!`);
        }

        message.channel.send(data).then((msg: any) => msg.delete({ timeout: 5000 })).catch((err: any) => {
            client.logger.error(err);
        });
    },
};
