import func from '../../lib/function';
import values from '../../lib/values';

const psvc = require('./../../database/services/point.service');

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
        // message.channel.send('Dalam perbaikan! Tidak ada fitur baru!');

        await psvc.addPoint('1234567890', 100);
        await psvc.addPoint('1234567890', 200);
        await psvc.addPoint('1234567890', 100);
        await psvc.addPoint('1234567890', 400);

        await psvc.addPoint('1234567890', -50);
        await psvc.addPoint('1234567890', -100);

        const sum = await psvc.getPoint('1234567890');
        console.log(sum);
    },
};
