import values from '../../../../lib/values';

module.exports = {
    name: 'logs',
    func: async (client: any, message: any, args: any) => {
        try {
            const server = client.mcsvc.server(values.mc_server_id);
            const logs = await server.getLogs();

            return message.channel.send(`\`\`\`\`${logs}\`\`\``).then((msg: any) => msg.delete({ timeout: 30000 })).catch((err: any) => client.logger.error(err));
        } catch (e) {
            return message.channel.send(e.message).then((msg: any) => {
                msg.delete({ timeout: 5000 });
                client.logger.error(e);
            });
        }
    },
};