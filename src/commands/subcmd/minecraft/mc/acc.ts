module.exports = {
    name: 'acc',
    func: async (client: any, message: any, args: any) => {
        try {
            const account = await client.mcsvc.getAccount();
            return message.channel.send(`Halo, __**${account.name.toUpperCase()}**__! Sisa kredit Anda adalah **${account.credits}**.`).then((msg: any) => msg.delete({ timeout: 30000 })).catch((err: any) => client.logger.error(err));
        } catch (e: any) {
            return message.channel.send(e.message).then((msg: any) => {
                msg.delete({ timeout: 5000 });
                client.logger.error(e);
            });
        }
    },
};