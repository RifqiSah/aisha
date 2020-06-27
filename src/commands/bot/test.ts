import func from '../../lib/function';

module.exports = {
    name: 'test',
    desc: 'Menguji coba fitur baru pada Aisha.',
    enable: true,
    regex: false,
    help: false,
    role: ['433870492378595329'],
    aliases: [],
    usage: '',
    cooldown: 0,
    func: async (client: any, message: any, args: any) => {
        message.channel.send('Dalam perbaikan! Tidak ada fitur baru!');
    },
};
