module.exports = {
    name: 'invite',
    desc: 'Berisi mengenai link invite server Informate.',
    enable: true,
    regex: true,
    help: false,
    role: [],
    aliases: ['inv', 'invt', 'invit'],
    usage: '',
    cooldown: 0,
    func: (client: any, message: any, args: any) => {
        message.channel.send('Link invite server dapat dilihat pada <#498123556413243412>');
    },
};
