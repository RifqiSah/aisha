module.exports = {
    name: 'snap',
    desc: 'Mengkosongkan pesan pada channel.',
    enable: true,
    regex: false,
    help: false,
    role: ['433870492378595329'],
    aliases: ['delete', 'prune', 'del', 'thanos'],
    usage: '[jumlah pesan]',
    cooldown: 0,
    func: async (client: any, message: any, args: any) => {
        message.delete();

        if (!args) return message.channel.send('Mohon masukkan jumlah pesan yang akan dihapus!').then((msg: any) => { msg.delete({ timeout: 5000 }); }).catch((err: any) => client.logger.error(err));
        if (isNaN(args)) return message.channel.send('Jumlah pesan tidak valid!').then((msg: any) => { msg.delete({ timeout: 5000 }); }).catch((err: any) => client.logger.error(err));

        if (args > 100) return message.channel.send('Maksimal pesan yang dihapus adalah 100!').then((msg: any) => { msg.delete({ timeout: 5000 }); }).catch((err: any) => client.logger.error(err));
        if (args < 1) return message.channel.send('Minimal pesan yang dihapus adalah 1!').then((msg: any) => { msg.delete({ timeout: 5000 }); }).catch((err: any) => client.logger.error(err));

        await message.channel.messages.fetch({ limit: args }).then((messages: any) => {
            message.channel.bulkDelete(messages);
        });

        message.channel.send(`${args} pesan telah dihapus!`).then((msg: any) => { msg.delete({ timeout: 5000 }); }).catch((err: any) => client.logger.error(err));
    },
};
