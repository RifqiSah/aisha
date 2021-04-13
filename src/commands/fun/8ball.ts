module.exports = {
    name: '8ball',
    desc: 'Asks the Magic 8-Ball for some psychic wisdom.',
    enable: true,
    regex: false,
    help: true,
    public: true,
    role: [],
    aliases: ['fortune'],
    usage: '',
    cooldown: 0,
    func: (client: any, message: any, args: any) => {
        const answers = [
            'It is certain.',
            'It is decidedly so.',
            'Without a doubt.',
            'Yes - definitely.',
            'You may rely on it.',
            'As I see it, yes.',
            'Most likely.',
            'Outlook good.',
            'Yes.',
            'Signs point to yes.',
            'Reply hazy, try again.',
            'Ask again later.',
            'Better not tell you now.',
            'Cannot predict now.',
            'Concentrate and ask again.',
            'Don\'t count on it.',
            'My reply is no.',
            'My sources say no.',
            'Outlook not so good.',
            'Very doubtful.'
        ];

        message.channel.send(`The Magic 8-Ball says: **${answers[Math.floor(Math.random() * answers.length)]}**`);
    },
};
