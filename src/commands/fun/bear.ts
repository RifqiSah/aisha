module.exports = {
    name: 'bear',
    desc: 'Pedo Bear?',
    enable: true,
    regex: true,
    help: false,
    public: true,
    role: [],
    aliases: [],
    usage: '',
    cooldown: 0,
    func: (client: any, message: any, args: any) => {
        const emot = [
            'ʕ•ᴥ•ʔ',
            'ʕ•ᴥ•ʔゝ☆',
            '＼ʕ•ᴥ•ʔ／',
            '＼ʕ•ᴥ•ʔ＼',
            '／ʕ•ᴥ•ʔ／',
            'ʕ˵•ₒ•˵ʔ',
            'ʕ•ₒ•ʔ',
            '┬┴┬┴┤•ᴥ•ʔ',
            'ʕᵒᴥᵒʔ',
            'ᶘಠᴥಠᶅ',
            'ᶘ ͡°ᴥ ͡°ᶅ',
            'ᶘ ͡°ʖ °ᶅ'
        ];
        message.channel.send(emot[Math.floor(Math.random() * emot.length)]);
    },
};
