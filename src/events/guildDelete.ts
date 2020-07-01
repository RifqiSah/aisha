module.exports = (client: any, guild: any) => {
    client.guildsvc.deleteGuild(guild.id);
    client.logger.info(`[-] Aisha telah keluar dari guild '${guild.name}' :()`);
};
