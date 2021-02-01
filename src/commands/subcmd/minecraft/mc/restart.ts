import values from '../../../../lib/values';

module.exports = {
    name: 'restart',
    func: async (client: any, message: any, args: any) => {
        try {
            const server = client.mcsvc.server(values.mc_server_id);
            await server.restart();

            return message.channel.send('Mohon tunggu beberapa detik hingga server offline dan online kembali!').then((msg: any) => msg.delete({ timeout: 30000 })).catch((err: any) => client.logger.error(err));
        } catch (e) {
            return message.channel.send(e.message).then((msg: any) => {
                msg.delete({ timeout: 5000 });
                client.logger.error(e);
            });
        }
    },
};