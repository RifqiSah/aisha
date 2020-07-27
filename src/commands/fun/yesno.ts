import { get } from 'superagent';
import values from '../../lib/values';

module.exports = {
    name: 'yesno',
    desc: 'Memberikan jawaban diantara `yes` atau `no`.',
    enable: true,
    regex: false,
    help: true,
    role: [],
    aliases: [],
    usage: '',
    cooldown: 0,
    func: async (client: any, message: any, args: any) => {
        get(values.yesno_api)
            .then((res) => {
                const yesno = JSON.parse(res.text);
                message.channel.send(yesno.image);
            })
            .catch((err) => {
                client.logger.error(err);
            });
    },
};
