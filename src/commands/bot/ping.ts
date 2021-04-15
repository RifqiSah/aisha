module.exports = {
    name: 'ping',
    desc: 'Mendapatkan latency API dan latency BOT kepada server Discord.',
    enable: true,
    regex: false,
    help: true,
    public: true,
    role: [],
    aliases: [],
    usage: '',
    cooldown: 0,
    func: (client: any, message: any, args: any) => {
        message.channel.send('Memeriksa ...').then((m: any) => {
            const ping = m.createdTimestamp - message.createdTimestamp;
            const choices = ['Ini adalah latency aku', 'Apakah baik-baik saja? Aku tidak dapat melihat!', 'Aku berharap ini tidak buruk!'];
            const response = choices[Math.floor(Math.random() * choices.length)];

            m.edit(`${response}\nBot Latency: \`${ping}\`, API Latency: \`${Math.round(client.bot.ws.ping)}\``);
        });
    },
};
