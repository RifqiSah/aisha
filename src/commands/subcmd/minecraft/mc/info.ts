import { get } from 'superagent';
import func from '../../../../lib/function';
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
    func: (client: any, message: any, args: any) => {
        get(`${values.mc_api}/server/${values.mc_serever_id}`)
            .set('Authorization', `Bearer ${client.config.MC_TOKEN}`)
            .then((res) => {
                const json = JSON.parse(res.text);

                if (!json.success) {
                    return message.channel.send(json.error);
                }

                const mcData = json.data;
                if (mcData) {
                    const data = [
                        `__**${mcData.name.toUpperCase()}**__`,
                        `${mcData.motd}`,

                        '\n__**Software**__',
                        `Name: ${mcData.software.name}`,
                        `Version: ${mcData.software.version}`,

                        '\n__**Server**__',
                        `Status: __**${status(mcData.status)}**__`,
                        `Players: ${mcData.players.count}/${mcData.players.max}`,

                    ];

                    return message.channel.send(data).then((msg: any) => msg.delete({ timeout: 30000 })).catch((err: any) => client.logger.error(err));
                }
            })
            .catch((err) => {
                client.logger.error(err);
            });
    },
};