import values from '../../../../lib/values';

const isOnline = (client: any, msg: any) => {
    return msg.edit('Server telah online!').then((msg: any) => msg.delete({ timeout: 30000 })).catch((err: any) => client.logger.error(err));
};

module.exports = {
    name: 'start',
    func: async (client: any, message: any, args: any) => {
        client.ev.on('mc_srv_online', isOnline);

        try {
            const server = client.mcsvc.server(values.mc_server_id);
            await server.start();

            return message.channel.send('Mohon tunggu beberapa detik hingga server online!').then((msg: any) => msg.delete({ timeout: 30000 })).catch((err: any) => client.logger.error(err));
        } catch (e) {
            return message.channel.send(e.message).then((msg: any) => {
                msg.delete({ timeout: 5000 });
                client.logger.error(e);
            });
        }
    },
};