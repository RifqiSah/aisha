module.exports = {
    name: 'alert',
    desc: 'Mengirim pesan **Penting** kepada para Organizer. Command ini digunakan jika ada pesan **penting** yang ingin segera disampaikan!.',
    enabled: true,
    regex: false,
    help: true,
    role: [],
    aliases: ['report'],
    usage: '[pesan anda]',
    cooldown: 60,
    func: (client: any, message: any, args: any) => {
        message.delete();

        const Organizer = message.guild.roles.find((role: any) => role.name === 'Organizer').members.array();
        for (const mOrganizer in Organizer) {
            Organizer[mOrganizer].user.send(`Anda mendapatkan pesan penting dari ${message.author.username}:`, {
                embed: {
                    color: 3447003,
                    description: args.join(' '),
                    footer: {
                        icon_url: message.author.avatarURL(),
                        text: message.author.tag,
                    },
                },
            // eslint-disable-next-line @typescript-eslint/no-empty-function
            }).catch(() => {});
        }

        message.reply('Sukses mengirim pesan kepada para Organizer!');
    },
};
