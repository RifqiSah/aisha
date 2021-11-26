import funct from '../lib/function';

module.exports = (client: any, member: any) => {
    const channel = member.guild.channels.cache.find((ch: any) => ch.id === '337424516362010625'); // Out-Off Topic
    if (!channel) {
        return;
    }

    channel.send(`Oh tidakk, ${member} telah keluar dari server kita 😔`);
};
