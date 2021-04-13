module.exports = {
    name: 'nganu',
    desc: 'Nganu?',
    enable: true,
    regex: true,
    help: false,
    public: true,
    role: [],
    aliases: ['anu', 'eww'],
    usage: '',
    cooldown: 0,
    func: (client: any, message: any, args: any) => {
        message.channel.send('( ͡° ͜ʖ ͡°)');
    },
};
