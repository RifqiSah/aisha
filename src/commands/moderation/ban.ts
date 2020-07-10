module.exports = {
    name: 'ban',
    desc: 'Untung mem_ban_ user yang nakal pada server.',
    enable: true,
    regex: false,
    help: false,
    role: ['372915947478056960', '372916656231415811'],
    aliases: [],
    usage: '[user] [alasan]',
    cooldown: 0,
    func: (client: any, message: any, args: any) => {
        message.delete();
        args.shift();

        const member = message.mentions.members.first();
        if (!member) {
            return message.channel.send('Mohon mention user yang akan diban!').then((msg: any) => msg.delete({ timeout: 5000 })).catch((err: any) => client.logger.error(err));
        }

        const alasan = args.join(' ');
        const channel = message.guild.channels.cache.find((ch: any) => ch.id === '337424516362010625'); // out-off-topic
        if (!channel) {
            return message.channel.send('Channel tidak ditemukan!').then((msg: any) => msg.delete({ timeout: 5000 })).catch((err: any) => client.logger.error(err));
        }

        member.ban().then((member: any) => {
            channel.send(`${member.displayName} telah dibanned oleh Aisha! Alasan:\n\`\`\`${alasan}!\`\`\``);
        });
    },
};
