import { get } from 'superagent';
import values from '../../../../lib/values';

module.exports = {
    name: 'restart',
    func: (client: any, message: any, args: any) => {
        get(`${values.mc_api}/server/${values.mc_serever_id}/restart`)
            .set('Authorization', `Bearer ${client.config.MC_TOKEN}`)
            .then((res) => {
                const json = JSON.parse(res.text);
                if (!json.success) {
                    return message.channel.send(json.error);
                }

                const data = [
                    'Mohon tunggu beberapa detik hingga server telah offline dan online kembali!'
                ];

                return message.channel.send(data).then((msg: any) => msg.delete({ timeout: 30000 })).catch((err: any) => client.logger.error(err));
            })
            .catch((err) => {
                client.logger.error(err);
            });
    },
};