import { get } from 'superagent';
import func from '../../lib/function';
import values from '../../lib/values';

const calc: any = {
    'eq': (a: number, b: number) => Number(a) === Number(b),
    'plus': (a: number, b: number) => Number(a) + Number(b),
    'min': (a: number, b: number) => Number(a) - Number(b),
    'lt': (a: number, b: number) => Number(a) < Number(b),
    'gt': (a: number, b: number) => Number(a) > Number(b),
};

module.exports = {
    name: 'tax',
    desc: 'Melihat tax atau pajak dari Trading House, Trade, Server Storage, dll.\nPajak yg tersedia yaitu:```> mail\n> th\n> trade```',
    enable: true,
    regex: false,
    help: true,
    public: true,
    role: [],
    aliases: ['pajak'],
    usage: '[jenis] [nominal]',
    cooldown: 0,
    func: async (client: any, message: any, args: any) => {
        const data = [];
        const taxes = await get(`${values.aisha_api}/taxes`)
            .then((res) => {
                return JSON.parse(res.text);
            }).catch((err) => {
                client.logger.error(err);
                return null;
            });

        if (!taxes) {
            return message.channel.send('Terjadi kesalahan dalam mengambil data!').then((msg: any) => msg.delete({ timeout: 10000 })).catch((err: any) => client.logger.error(err));
        }

        let tax = null;
        let tax2 = null;
        let op = '';

        switch (args[0]) {
            case 'th':
                tax = taxes.marketSellFee;
                tax2 = taxes.listingFee;
                op = 'min';
                break;

            case 'mail':
                tax = taxes.mailFee;
                op = 'plus';
                break;

            case 'trade':
                tax = taxes.tradeFee;
                op = 'plus';
                break;

            default:
                // data.push(`Tax untuk \`${args[0]}\` tidak ditemukan!`);
        }

        if (!tax || !op) {
            data.push(`Tax untuk \`${args[0]}\` tidak ditemukan atau terjadi kesalahan!`);
        }

        const cost = args[1];
        const taxCost = tax * cost;
        const total = calc[op](cost, taxCost);

        data.push(`Nilai: \`${func.formatNumber(cost)}\``);
        data.push(`Pajak: \`${func.formatNumber(taxCost)} (${tax * 100}%)\``);
        if (args[0] === 'th' && tax2) {
            data.push(`Tanpa tiket TH? Ditambah: \`${func.formatNumber(tax2 * cost)} (${tax2 * 100}%)\``);
        }

        data.push('--');

        if (op === 'plus') {
            data.push(`Total yang dikeluarkan: \`${func.formatNumber(total)}\``);
        } else if (op === 'min') {
            data.push(`Total yang didapat: \`${func.formatNumber(total)}\``);
        }

        data.push(`\nGunakan \`${client.config.BOT_PREFIX}help tax\` untuk melihat daftar pajak yang tersedia.\n`);
        message.channel.send(data.join('\n'), { split: true });
    }
};
