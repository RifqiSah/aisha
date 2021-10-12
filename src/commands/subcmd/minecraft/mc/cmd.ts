import values from '../../../../lib/values';

module.exports = {
    name: 'cmd',
    func: async (client: any, message: any, args: any) => {
        try {
            args.shift();

            const cmd = args.join(' ');
            const server = client.mcsvc.server(values.mc_server_id);
            await server.executeCommand(cmd);

            return message.channel.send('Sukses!').then((msg: any) => msg.delete({ timeout: 30000 })).catch((err: any) => client.logger.error(err));
        } catch (e: any) {
            return message.channel.send(e.message).then((msg: any) => {
                msg.delete({ timeout: 5000 });
                client.logger.error(e);
            });
        }
    },
};