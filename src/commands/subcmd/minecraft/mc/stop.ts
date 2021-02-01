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
                    msgs.edit('Server telah dimatikan! Terima kasih telah bermain :D').then((msg: any) => msg.delete({ timeout: 30000 })).catch((err: any) => client.logger.error(err));
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