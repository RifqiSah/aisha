module.exports = {
    name: 'invite',
    desc: 'Berisi mengenai link invite server Informate.',
    enable: true,
    regex: true,
    help: false,
    public: false,
    role: [],
    aliases: ['inv', 'invt', 'invit'],
    usage: '',
    cooldown: 0,
    func: (client: any, message: any, args: any) => {
        if (message.guild.id === '306617555332628480') {
            message.channel.send('Link invite server dapat dilihat pada <#498123556413243412>');
        } else {
            message.channel.send('Jika Anda memiliki pertanyaan, jangan ragu untuk bergabung dengan server **Informate Community Discord** (https://discord.gg/UA6gYhx84m) dan ajukan pertanyaan yang Anda inginkan.');
        }
    },
};
