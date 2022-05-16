import { loadData } from '../../../../helpers/function';

module.exports = {
    name: 'reload',
    func: async (client: any, message: any, args: any) => {
        const type: string = args[1];

        if (!type) {
            return message.channel.send('Mohon masukkan type!').then((msg: any) => msg.delete({ timeout: 5000 })).catch((err: any) => {
                client.logger.error(err);
            });
        }

        if (type === 'data') {
            await loadData();
        } else {
            return message.channel.send(`Reload ${type} tidak ditemukan!`).then((msg: any) => msg.delete({ timeout: 5000 })).catch((err: any) => {
                client.logger.error(err);
            });
        }

        return message.channel.send(`Sukses menjalankan reload ${type}!`).then((msg: any) => msg.delete({ timeout: 5000 })).catch((err: any) => {
            client.logger.error(err);
        });
    }
};