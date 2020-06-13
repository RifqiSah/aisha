module.exports = {
    name: 'nganu',
    desc: 'Nganu?',
    enable: true,
    regex: true,
    help: false,
    role: [],
    aliases: ['anu', 'eww'],
    usage: '',
    cooldown: 0,
    func: (client: any, message: any, args: any) => {
        const emot = ['uwu', 'hahaha'];
        const wkwkwk = emot[Math.floor(Math.random() * emot.length)];
        
        message.channel.send('( ͡° ͜ʖ ͡°)');
    },
};
