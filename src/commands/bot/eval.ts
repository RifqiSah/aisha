const { inspect } = require('util');

module.exports = {
    name: 'eval',
    desc: 'Menjalankan scrip bash Linux!.',
    enable: true,
    regex: false,
    help: false,
    role: ['372915947478056960'],
    aliases: ['e', 'run', 'start'],
    usage: '[input]',
    cooldown: 0,
    func: async (client: any, message: any, args: any) => {
        if (message.author.id !== client.config.OWNER) return message.channel.send('Anda bukan pemilik hati aku!');

        const toEval = args.join(' ');
        const evaluated = inspect(eval(toEval));

        try {
            if (toEval) {
                const hrStart = process.hrtime();
                const hrDiff = process.hrtime(hrStart);

                return message.channel.send(`Executed in \`${hrDiff[0] > 0 ? `${hrDiff[0]}s` : ''}${hrDiff[1] / 1000000}ms\`\n\`\`\`javascript\n${evaluated}\n\`\`\``, { maxLength: 1900 });
            }

            message.channel.send('ERROR: `Cannot evaluated air!`');
        } catch (e) {
            message.channel.send(`ERROR: \`${e.message}\``);
        }
    },
};
