module.exports = (client: any) => {
    client.bot.user.setUsername(client.config.BOT_NAME);
    // bot.user.setAvatar("");

    client.logger.info(`[V] Bot has started, with ${client.bot.users.cache.size} users, in ${client.bot.channels.cache.size} channels of ${client.bot.guilds.cache.size} guilds.`);

    const activitiesList = [
        `${client.config.BOT_PREFIX}h for command.`,
        // `${client.config.BOT_VERSION} is running.`,
        "Informate's Bot.",
        `Serving ${client.bot.users.cache.size} users in ${client.bot.guilds.cache.size} guilds.`,
    ];

    setInterval(() => {
        // bot.user.setStatus('dnd');
        client.bot.user.setActivity(activitiesList[Math.floor(Math.random() * activitiesList.length)]/* , { type: "WATCHING" } */);
    }, 10000);

    // Untuk ad-role select
    client.bot.channels.cache.get('668661382228475915').messages.fetch('668673903014707220');
};
