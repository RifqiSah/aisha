module.exports = (client: any, guild: any) => {
    client.guildsvc.deleteGuild(guild.id);
    console.log(`[-] Aisha telah keluar dari guild '${guild.name}' :()`);
};
