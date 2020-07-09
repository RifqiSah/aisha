module.exports = {
    name: 'agree',
    desc: 'Untuk verifikasi member apakah menyetujui peraturan yang dibuat.',
    enable: true,
    regex: false,
    help: false,
    role: ['669544469594374145'],
    aliases: ['setuju', 'ya'],
    usage: '',
    cooldown: 0,
    func: (client: any, message: any, args: any) => {
        const channel = message.guild.channels.cache.find((ch: any) => ch.id === '652149362423627787'); // member-agreement
        if (!channel) return;

        channel.send(`\`${message.author.tag}\` telah menyetujui peraturan!`);
        message.reply('Terima kasih sudah menyetujui peraturan yang dibuat.\n\nJika kedapatan melanggar, kami akan segera mengeluarkan Anda dari Discord demi kenyamanan.\n\nTerima kasih.').then((msg: any) => { msg.delete({ timeout: 10000 }); }).catch((err: any) => client.logger.error(err));

        message.delete();
        message.member.roles.remove('669544469594374145'); // new-member
        message.member.roles.add('668439117264191498'); // buat rolenya guest aja sementara
    },
};
