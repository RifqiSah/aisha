import { ApplicationCommandOptionType, AutocompleteInteraction, CommandInteraction } from 'discord.js';

import Command from '../../classes/command';
import { formatNumber, formatTitleCase } from '../../helpers/function';
import axios from '../../lib/axios';
import { logger } from '../../lib/logger';
import values from '../../lib/values';

const calc: any = {
    'eq': (a: number, b: number) => Number(a) === Number(b),
    'plus': (a: number, b: number) => Number(a) + Number(b),
    'min': (a: number, b: number) => Number(a) - Number(b),
    'lt': (a: number, b: number) => Number(a) < Number(b),
    'gt': (a: number, b: number) => Number(a) > Number(b),
};

const getTaxes = async () => {
    const result = await axios.get(`${values.aisha_v1_api}/taxes`, {
        headers: {
            apikey: values.api_key,
        }
    });
    return result.data.data;
};

const hitung = (taxes: any, type: string, nominal: number) => {
    const data = [];

    let tax = null;
    let tax2 = null;
    let op = '';

    switch (type) {
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
            // data.push(`Tax untuk \`${type}\` tidak ditemukan!`);
    }

    if (!tax || !op) {
        data.push(`Tax untuk \`${type}\` tidak ditemukan atau terjadi kesalahan!`);
    }

    const cost = Number(nominal);
    const taxCost = tax * cost;
    const total = calc[op](cost, taxCost);

    data.push(`Jenis: \`${formatTitleCase(type)}\``);
    data.push(`Nilai: \`${formatNumber(cost)}\``);
    data.push(`Pajak: \`${formatNumber(taxCost)} (${tax * 100}%)\``);
    if (type === 'th' && tax2) {
        data.push(`Tanpa tiket TH? Ditambah: \`${formatNumber(tax2 * cost)} (${tax2 * 100}%)\``);
    }

    // data.push('\n');

    if (op === 'plus') {
        data.push(`Total yang dikeluarkan: \`${formatNumber(total)}\``);
    } else if (op === 'min') {
        data.push(`Total yang didapat: \`${formatNumber(total)}\``);
    }

    return data;
};

export default class DnTax extends Command {
    constructor() {
        super({
            name: 'Melihat tax atau pajak dari Trading House, Trade, Server Storage, dll.',
            command: 'dntax',
            usage: '[mail/th/trade] [nominal]',
            registerSlashCommand: true,
            hasAutocomplete: true,
            slashCommandOptions: [
                {
                    name: 'type',
                    description: 'Mail / TH / Trade',
                    type: ApplicationCommandOptionType.String,
                    choices: [{ name: 'Mail', value: 'mail' }, { name: 'Trading House', value: 'th' }, { name: 'Trade', value: 'trade' }],
                },
                {
                    name: 'nominal',
                    description: 'Nominal Gold',
                    type: ApplicationCommandOptionType.Number,
                },
            ],
        });
    }

    async interact(interaction: CommandInteraction): Promise<void> {
        let msg: string[] = [];

        try {
            await interaction.deferReply();

            const type = interaction.options.get('type')?.value;
            const nominal = interaction.options.get('nominal')?.value;

            const taxes = await getTaxes();

            msg.push('__**Informasi Tax Dragon Nest**__\n');
            msg = msg.concat(hitung(taxes, type as string, nominal as number));

            interaction.editReply({ content: msg.join('\n') });
        } catch (err) {
            await interaction.editReply({ content: 'Data tidak ditemukan! Mohon hanya gunakan data yg sudah disediakan!' });
            console.error(err);
        }
    }

    async autocomplete(interaction: AutocompleteInteraction): Promise<void> {
        null;
    }
}