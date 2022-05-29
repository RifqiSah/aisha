import { sendAndDelete } from '../../../../helpers/bot';
import values from '../../../../lib/values';

module.exports = {
    name: 'logs',
    func: async (client: any, message: any, args: any) => {
        try {
            const server = client.mcsvc.server(values.mc_server_id);
            const logs = await server.getLogs();

            return sendAndDelete(message, `\`\`\`\`${logs}\`\`\``, 30000);
        } catch (e: any) {
            return message.channel.send(e.message).then((msg: any) => {
                setTimeout(() => msg.delete(), 5000);
                client.logger.error(e);
            });
        }
    },
};