module.exports = {
    name: 'rps',
    desc: 'Bermain batu gunting kertas.',
    enable: true,
    regex: false,
    help: true,
    role: [],
    aliases: ['coin', 'cointoss', 'flip'],
    usage: '[rock | paper | scissors]',
    cooldown: 0,
    func: async (client: any, message: any, args: any) => {
        message.delete();

        const rps = ['scissors','rock', 'paper'];
        const res = ['Scissors :v:','Rock :fist:', 'Paper :raised_hand:'];

        let userChoice;
        if (args.length) userChoice = args[0].toLowerCase();
        if (!rps.includes(userChoice)) {
            return message.channel.send(`Maaf ${message.member}, Aku tidak mengenali itu. Mohon masukkan \`rock\`, \`paper\`, atau \`scissors\`.`).then((msg: any) => msg.delete({ timeout: 5000 })).catch((err: any) => client.logger.error(err));
        }

        userChoice = rps.indexOf(userChoice);
        const botChoice = Math.floor(Math.random() * 3);
        let result;
        if (userChoice === botChoice) {
            result = 'Wah sayang sekali, hasilnya seri!';
        } else if (botChoice > userChoice || botChoice === 0 && userChoice === 2) {
            await client.pointsvc.addPoint(message.author.id, -5);
            result = '**Aisha** menang! Maaf, kamu telah kehilangan point sebesar **5** point :frowning:';
        } else {
            await client.pointsvc.addPoint(message.author.id, 10);
            result = `**${message.member.displayName}** menang! Selamat, kamu mendapatkan **10** point!`;
        }

        return message.channel.send(`${message.member.displayName}: ${res[userChoice]}\nAisha: ${res[botChoice]}\n\n${result}`).then((msg: any) => msg.delete({ timeout: 10000 })).catch((err: any) => client.logger.error(err));
    },
};
