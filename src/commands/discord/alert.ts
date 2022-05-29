import { sendAndDelete } from '../../helpers/bot';

module.exports = {
    name: 'alert',
    desc: 'Mengirim pesan **Penting** kepada pengurus. Command ini digunakan jika ada pesan **penting** yang ingin segera disampaikan!.',
    enable: true,
    regex: false,
    help: true,
    public: false,
    role: ['372929327903408150', '668439117264191498'],
    aliases: ['report'],
    usage: '[pesan anda]',
    cooldown: 60,
    func: (client: any, message: any, args: any) => {
        if (!args.length) {
            return sendAndDelete(message, 'Harap masukkan pesan Anda!', 5000);
        }

        message.delete();

        const channel = message.guild.channels.cache.find((ch: any) => ch.id === '917430153586565120'); // member-log
        if (!channel) {
            return;
        }

        channel.send(`Anda mendapatkan pesan penting dari **${message.author.tag}**:\n\`\`\`${args.join(' ')}\`\`\``);

        return message.channel.send('Sukses mengirim pesan kepada pengurus!');
    },
};
