module.exports = (client: any, guild: any) => {
    client.guildsvc.addGuild(guild.id, guild.name);
    console.log(`[-] Aisha telah masuk kedalam guild '${guild.name}' [${guild.id}]`);
};
