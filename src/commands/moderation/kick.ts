module.exports = {
    name: 'kick',
    desc: 'Untung men_kick_ user yang nakal pada server.',
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
        const alasan = args.join(' ');
        const channel = message.guild.channels.cache.find((ch: any) => ch.id === '337424516362010625'); // out-off-topic
        
        member.kick().then((member: any) => {
            channel.send(`${member.displayName} telah dikick oleh Aisha! Alasan:\n\`\`\`${alasan}!\`\`\``);
        });
    },
};
