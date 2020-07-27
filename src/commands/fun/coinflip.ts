module.exports = {
    name: 'coinflip',
    desc: 'Melempatkan koin.',
    enable: true,
    regex: false,
    help: true,
    role: [],
    aliases: ['coin', 'cointoss', 'flip'],
    usage: '',
    cooldown: 0,
    func: (client: any, message: any, args: any) => {
        const n = Math.floor(Math.random() * 2);
        let result;
        if (n === 1) result = 'kepala';
        else result = 'ekor';

        message.channel.send(`Aku melemparkan koin untukmu, ${message.member}. Hasilnya adalah **${result}**!`);
    },
};
