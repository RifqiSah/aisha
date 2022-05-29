import { editAndDelete } from '../../../../helpers/bot';
import values from '../../../../lib/values';

module.exports = {
    name: 'stop',
    func: async (client: any, message: any, args: any) => {
        const msgs = await message.channel.send('Mohon tunggu sebentar ...');

        try {
            const server = client.mcsvc.server(values.mc_server_id);
            await server.stop();

            const refreshId = setInterval(() => {
                const status = server.get().status;
                if (server.hasStatus(server.STATUS.OFFLINE)) {
                    editAndDelete(msgs, 'Server telah dimatikan! Terima kasih telah bermain 😃', 30000);
                    clearInterval(refreshId);
                }
            }, 5000);

            return true;
        } catch (e: any) {
            return msgs.edit(e.message).then((msg: any) => {
                setTimeout(() => msg.delete(), 5000);
                client.logger.error(e);
            });
        }
    },
};