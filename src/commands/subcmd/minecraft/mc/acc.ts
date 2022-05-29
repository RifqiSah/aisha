import { sendAndDelete } from '../../../../helpers/bot';

module.exports = {
    name: 'acc',
    func: async (client: any, message: any, args: any) => {
        try {
            const account = await client.mcsvc.getAccount();
            return sendAndDelete(message, `Halo, __**${account.name.toUpperCase()}**__! Sisa kredit Anda adalah **${account.credits}**.`, 30000);
        } catch (e: any) {
            return message.channel.send(e.message).then((msg: any) => {
                setTimeout(() => msg.delete(), 5000);
                client.logger.error(e);
            });
        }
    },
};