/* eslint-disable consistent-return */
module.exports = {
    name: 'shutdown',
    desc: 'Matikan bot!.',
    enable: true,
    regex: false,
    help: false,
    role: ['372915947478056960'],
    aliases: ['turnoff', 'botkill', 'botstop'],
    usage: '',
    cooldown: 60,
    func: async (client: any, message: any, args: any) => {
        if (message.author.id !== client.config.BOT_OWNER) {
            return message.channel.send('Anda bukan pemilik hati aku!');
        }
        
        try {
            await message.channel.send('Aisha pergi dulu ya! Bye bye ~');
            process.exit();
        } catch (e) {
            message.channel.send(`ERROR: ${e.message}`);
        }
    },
};
