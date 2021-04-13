import { get } from 'superagent';
import values from '../../lib/values';

module.exports = {
    name: 'cat',
    desc: 'Mpus?',
    enable: true,
    regex: true,
    help: false,
    public: true,
    role: [],
    aliases: ['mpus', 'meow', 'meong', 'puss'],
    usage: '',
    cooldown: 0,
    func: async (client: any, message: any, args: any) => {
        get(values.cat_api)
            .set('x-api-key', values.cat_apikey)
            .then((res) => {
                const cat = JSON.parse(res.text);
                message.channel.send(cat[0].url);
            })
            .catch((err) => {
                client.logger.error(err);
            });
    },
};
