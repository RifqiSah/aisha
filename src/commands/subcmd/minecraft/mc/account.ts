module.exports = {
    name: 'account',
    func: async (client: any, message: any, args: any) => {
        try {
            const account = await client.mcsvc.getAccount();
            return message.channel.send(`__**${account.name.toUpperCase()}**__ with **${account.credits}** credits.`).then((msg: any) => msg.delete({ timeout: 30000 })).catch((err: any) => client.logger.error(err));
        } catch (e) {
            return message.channel.send(e.message).then((msg: any) => {
                msg.delete({ timeout: 5000 });
                client.logger.error(e);
            });
        }
    },
};