module.exports = (client: any) => {
    if (client.config.ENV === 'production') {
        client.bot.user.setUsername('Aisha');
    } else {
        client.bot.user.setUsername('Aisha [Test]');
        client.config.PREFIX = '%';
    }

    // bot.user.setAvatar("");

    console.log(`[V] Bot has started, with ${client.bot.users.cache.size} users, in ${client.bot.channels.cache.size} channels of ${client.bot.guilds.cache.size} guilds.`);

    const activitiesList = [
        `${client.config.PREFIX}h for command.`,
        `${client.config.VERSION} is running.`,
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
