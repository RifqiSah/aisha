import { sendAndDelete } from '../../helpers/bot';

module.exports = {
    name: 'bot',
    desc: 'Control panel untuk Aisha.',
    enable: true,
    regex: false,
    help: false,
    public: false,
    role: ['372915947478056960'],
    aliases: [],
    usage: '[sub command] [param]',
    cooldown: 0,
    func: async (client: any, message: any, args: any) => {
        message.delete();

        if (!args.length) {
            return sendAndDelete(message, 'Harap masukkan parameter!', 5000);
        }

        const subcmdname = args[0];
        const subcmd = client.subcmds.get(`bot.${subcmdname}`);

        if (!subcmd) {
            return sendAndDelete(message, `Pengaturan untuk \`${subcmdname}\` tidak ditemukan!`, 5000);
        }

        return subcmd.func(client, message, args);
    },
};
