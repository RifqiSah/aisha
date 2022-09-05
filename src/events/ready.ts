module.exports = (client: any) => {
    try {
        client.bot.user.setUsername(client.config.BOT_NAME);
        // bot.user.setAvatar("");

        client.logger.info(`[V] Bot has started, with ${client.bot.users.cache.size} users, in ${client.bot.channels.cache.size} channels of ${client.bot.guilds.cache.size} guilds.`);

        const activitiesList = [
            '/help for commands',
            // "Informate's Bot.",
            `Serving ${client.bot.users.cache.size} users in ${client.bot.guilds.cache.size} guilds`,
            // `Ver. ${client.config.BOT_VERSION}`
        ];

        setInterval(() => {
            // bot.user.setStatus('dnd');
            client.bot.user.setActivity(activitiesList[Math.floor(Math.random() * activitiesList.length)]/* , { type: "WATCHING" } */);
        }, 10000);
    } catch (err: any) {
        client.logger.error(err);
    }
};
