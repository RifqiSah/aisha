import { get } from 'superagent';
import func from '../../lib/function';
import values from '../../lib/values';

module.exports = {
    name: 'discordstatus',
    desc: 'Melihat status dari Discord API.',
    enable: true,
    regex: false,
    help: true,
    public: false,
    role: ['433870492378595329'],
    aliases: [],
    usage: '',
    cooldown: 0,
    func: (client: any, message: any, args: any) => {
        get(values.d_status_api)
            .then((res) => {
                const json = JSON.parse(res.text);
                if (json.incidents.length === 0) {
                    return message.channel.send(`All Systems Operational, last update: **${func.parseDate(json.page.updated_at).fromNow()}**.`);
                }

                const incident = json.incidents[0];
                if (incident) {
                    const data = [
                        `https://status.discord.com/incidents/${incident.incident_id}/`,
                        `${func.parseDate(incident.created_at).format('MMMM Do YYYY, h:mm:ss a')}`,
                        '\n__**Details**__:',
                        `${incident.incident_updates[0].body}`,
                    ];

                    return message.channel.send(data);
                }
            })
            .catch((err) => {
                client.logger.error(err);
            });
    },
};
