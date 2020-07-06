import { get } from 'superagent';
import func from '../../lib/function';
import values from '../../lib/values';

module.exports = {
    name: 'tax',
    desc: 'Melihat tax atau pajak dari Trading House, Trade, Server Storage, dll.\nPajak yg tersedia yaitu:```> mail\n> th\n> trade```',
    enable: true,
    regex: false,
    help: true,
    role: [],
    aliases: ['pajak'],
    usage: '[jenis] [nominal]',
    cooldown: 0,
    func: async (client: any, message: any, args: any) => {
        const data = [];
        const taxes = await get(`${values.divinitor_api}/taxes`)
            .then((res) => {
                return JSON.parse(res.text);
            }).catch((err) => {
                client.logger.error(err);
                return null;
            });

        if (!taxes) {
            return message.channel.send('Terjadi kesalahan dalam mengambil data!').then((msg: any) => msg.delete({ timeout: 10000 })).catch();
        }

        let tax = null;
        switch (args[0]) {
            case 'th':
                tax = taxes.marketSellFee;
                break;

            case 'mail':
                tax = taxes.mailFee;
                break;

            case 'trade':
                tax = taxes.tradeFee;
                break;

            default:
                data.push(`Tax untuk \`${args[0]}\` tidak ditemukan!`);
        }

        if (tax) {
            const cost = args[1];
            const taxCost = tax * cost;
            const total = cost - taxCost;

            data.push(`Harga barang: \`${func.formatNumber(cost)}\``);
            data.push(`Pajak: \`${func.formatNumber(taxCost)} (${tax * 100}%)\``);
            data.push(`Total yang didapatkan: \`${func.formatNumber(total)}\``);
        }

        data.push(`\nGunakan \`${client.config.BOT_PREFIX}help tax\` untuk melihat daftar pajak yang tersedia.\n`);
        message.channel.send(data, { split: true });
    }
};
