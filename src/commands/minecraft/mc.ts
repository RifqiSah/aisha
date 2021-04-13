module.exports = {
    name: 'mc',
    desc: 'Control panel untuk Minecraft Server.',
    enable: true,
    regex: false,
    help: false,
    public: false,
    role: ['802718208180092939'],
    aliases: [],
    usage: '[sub command] [param]',
    cooldown: 0,
    func: async (client: any, message: any, args: any) => {
        message.delete();

        if (!args.length) {
            return message.channel.send('Harap masukkan parameter!').then((msg: any) => msg.delete({ timeout: 5000 })).catch((err: any) => {
                client.logger.error(err);
            });
        }

        const subcmdname = args[0];
        const subcmd = client.subcmds.get(`mc.${subcmdname}`);

        if (!subcmd) {
            return message.channel.send(`Pengaturan untuk \`${subcmdname}\` tidak ditemukan!`).then((msg: any) => msg.delete({ timeout: 5000 })).catch((err: any) => {
                client.logger.error(err);
            });
        }

        return subcmd.func(client, message, args);
    },
};
