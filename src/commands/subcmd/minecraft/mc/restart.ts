import values from '../../../../lib/values';

module.exports = {
    name: 'restart',
    func: async (client: any, message: any, args: any) => {
        const msgs = await message.channel.send('Mohon tunggu sebentar ...');

        try {
            const server = client.mcsvc.server(values.mc_server_id);
            await server.restart();

            const refreshId = setInterval(() => {
                const status = server.get().status;
                if (server.hasStatus(server.STATUS.ONLINE)) {
                    msgs.edit('Server telah di-restart!').then((msg: any) => msg.delete({ timeout: 30000 })).catch((err: any) => client.logger.error(err));
                    clearInterval(refreshId);
                }
            }, 5000);

            return true;
        } catch (e) {
            return msgs.edit(e.message).then((msg: any) => {
                msg.delete({ timeout: 5000 });
                client.logger.error(e);
            });
        }
    },
};