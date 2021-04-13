module.exports = {
    name: 'alert',
    desc: 'Mengirim pesan **Penting** kepada para Organizer. Command ini digunakan jika ada pesan **penting** yang ingin segera disampaikan!.',
    enabled: true,
    regex: false,
    help: true,
    public: false,
    role: ['372929327903408150', '668439117264191498'],
    aliases: ['report'],
    usage: '[pesan anda]',
    cooldown: 60,
    func: (client: any, message: any, args: any) => {
        if (!args.length) {
            return message.channel.send('Harap masukkan pesan Anda!').then((msg: any) => msg.delete({ timeout: 5000 })).catch((err: any) => {
                client.logger.error(err);
            });
        }

        message.delete();

        const organizers = message.guild.roles.find((role: any) => role.name === 'Organizer').members.array();
        for (const organizer in organizers) {
            organizers[organizer].user.send(`Anda mendapatkan pesan penting dari ${message.author.username}:`, {
                embed: {
                    color: 3447003,
                    description: args.join(' '),
                    footer: {
                        icon_url: message.author.avatarURL(),
                        text: message.author.tag,
                    },
                },
            }).catch((err: any) => client.logger.error(err));
        }

        message.reply('Sukses mengirim pesan kepada para Organizer!');
    },
};
