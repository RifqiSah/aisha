module.exports = {
    name: 'pewpew',
    desc: 'Pewpew?',
    enable: true,
    regex: true,
    help: false,
    public: true,
    role: [],
    aliases: ['pew'],
    usage: '',
    cooldown: 0,
    func: (client: any, message: any, args: any) => {
        message.channel.send('╰( ͡° ͜ʖ ͡° )つ──☆*:・ﾟ pew pew magic');
    },
};
