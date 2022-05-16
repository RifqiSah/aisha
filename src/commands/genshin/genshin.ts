/* eslint-disable import/order */

import Fuse from 'fuse.js';

import { generateArtifactEmbed } from '../../helpers/genshin/artifacts';
import { generateBuildEmbed } from '../../helpers/genshin/characters';
import { generateWeaponEmbed } from '../../helpers/genshin/weapons';

import { artifacts } from '../../helpers/genshin/data/artifacts';
import { characters } from '../../helpers/genshin/data/characters';
import { weaponList } from '../../helpers/genshin/data/weaponMaterials';

import { sendMessage } from '../../helpers/function';

const searchable = [
    ...Object.entries(weaponList).map(([key, data]) => ({
        key,
        type: 'weapon',
        name: data.name,
    })),
    ...Object.entries(characters).map(([key, data]) => ({
        key,
        type: 'character',
        name: data.name,
    })),
    ...Object.entries(artifacts).map(([key, data]) => ({
        key,
        type: 'artifact',
        name: data.name,
    })),
];

const engine = new Fuse(searchable, {
    keys: ['name'],
});

const search = async (msg: any, query: string) => {
    const result = engine.search(query);

    if (result.length > 0) {
        const item = result[0].item;
        switch (item.type) {
            case 'artifact':
                return generateArtifactEmbed(item.key);
                break;
            case 'weapon':
                return generateWeaponEmbed(item.key);
                break;
            case 'character':
                console.log(item.key);
                break;
        }
    } else {
        console.log(`Cannot find something about ${query} 😕`);
    }
};

module.exports = {
    name: 'genshin',
    desc: 'Cari hal terkait Genshin Impact. Biarkan kata kunci kosong untuk menunjukkan item apa yang dapat dicari hari ini.',
    enable: true,
    regex: false,
    help: true,
    public: true,
    role: [],
    aliases: [],
    usage: '[keyword]',
    cooldown: 0,
    func: async (client: any, message: any, args: any) => {
        const keyword = (args.length ? args.join(' ').toLowerCase() : 'null');
        const msg: string[] = [];

        const embed = await search(msg, keyword);
        if (embed) message.channel.send({ embeds: [embed] });

        msg.push(`\nGunakan \`${client.config.BOT_PREFIX}help genshin\` untuk melihat daftar hal yang tersedia.\n`);
        sendMessage(message, msg);
    },
};
