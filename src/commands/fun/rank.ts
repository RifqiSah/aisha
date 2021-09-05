module.exports = {
    name: 'rank',
    desc: 'Melihat ranking perolehan point semua user.',
    enable: true,
    regex: false,
    help: true,
    public: true,
    role: [],
    aliases: [],
    usage: '',
    cooldown: 0,
    func: async (client: any, message: any, args: any) => {
        const data = [];
        let index = 1;

        data.push('Ranking perolehan point:```');

        const rank = await client.pointsvc.rank(message.author.id);
        await rank.eachAsync((row: any) => {
            const user = client.bot.users.cache.get(row.userId);
            const same = row.userId == message.author.id;

            data.push(`${index}: ${row.point} [${user.tag}] ${same ? '<- ini kamu :)' : ''}`);
            index++;
        });

        data.push('```');
        data.push(`Ayo tingkatkan point kamu dengan dengan bermain quiz! Quiz dapat dilihat melalui command \`${client.config.BOT_PREFIX}help\`.`);

        return message.channel.send(data.join('\n')).catch((err: any) => {
            client.logger.error(err);
        });
    },
};
