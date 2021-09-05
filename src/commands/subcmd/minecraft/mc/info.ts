import values from '../../../../lib/values';

const status = (id: any) => {
    if (id === 0) return 'OFFLINE';
    else if (id === 1) return 'ONLINE';
    else if (id === 2) return 'STARTING';
    else if (id === 3) return 'STOPPING';
    else if (id === 4) return 'RESTARTING';
    else if (id === 5) return 'SAVING';
    else if (id === 6) return 'LOADING';
    else if (id === 7) return 'CRASHED';
    else if (id === 8) return 'PENDING';
    else if (id === 10) return 'PREPARING';
    else return 'UNKNOWN';
};

module.exports = {
    name: 'info',
    func: async (client: any, message: any, args: any) => {
        try {
            const server = await client.mcsvc.server(values.mc_server_id).get();
            const data = [
                `__**${server.name.toUpperCase()}**__`,
                `${server.motd}`,

                '\n__**Software**__',
                `Name: ${server.software.name}`,
                `Version: ${server.software.version}`,

                '\n__**Server**__',
                `Status: __**${status(server.status)}**__`,
                `Players: ${server.players.count}/${server.players.max}`,
            ];

            return message.channel.send(data).then((msg: any) => msg.delete({ timeout: 30000 })).catch((err: any) => client.logger.error(err));
        } catch (e: any) {
            return message.channel.send(e.message).then((msg: any) => {
                msg.delete({ timeout: 5000 });
                client.logger.error(e);
            });
        }
    },
};