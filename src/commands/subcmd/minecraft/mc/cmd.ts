import { sendAndDelete } from '../../../../helpers/bot';
import values from '../../../../lib/values';

module.exports = {
    name: 'cmd',
    func: async (client: any, message: any, args: any) => {
        try {
            args.shift();

            const cmd = args.join(' ');
            const server = client.mcsvc.server(values.mc_server_id);
            await server.executeCommand(cmd);

            return sendAndDelete(message, 'Sukses!', 30000);
        } catch (e: any) {
            return message.channel.send(e.message).then((msg: any) => {
                setTimeout(() => msg.delete(), 5000);
                client.logger.error(e);
            });
        }
    },
};