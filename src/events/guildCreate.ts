module.exports = (client: any, guild: any) => {
    client.guildsvc.addGuild(guild.id, guild.name);
    client.logger.info(`[-] Aisha telah masuk kedalam guild '${guild.name}' [${guild.id}]`);
};
