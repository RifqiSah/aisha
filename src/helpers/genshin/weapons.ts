import { EmbedBuilder } from 'discord.js';
import { itemGroup } from './data/itemGroup';
import { weaponList as weaponMaterials } from './data/weaponMaterials';
import { weapons } from './data/weapons';

const secondary: {
    [key: string]: { name: string; multiplier: number; suffix: string };
} = {
    atk: { name: 'ATK', multiplier: 1, suffix: '' },
    defPercent: { name: 'DEF', multiplier: 100, suffix: '%' },
    atkPercent: { name: 'ATK%', multiplier: 100, suffix: '%' },
    physicalDamage: { name: 'Phys DMG%', multiplier: 100, suffix: '%' },
    critDamage: { name: 'CRIT Damage', multiplier: 100, suffix: '%' },
    critRate: { name: 'CRIT Rate', multiplier: 100, suffix: '%' },
    em: { name: 'Elemental Mastery', multiplier: 1, suffix: '' },
    er: { name: 'Energy Recharge', multiplier: 100, suffix: '%' },
    hpPercent: { name: 'HP%', multiplier: 100, suffix: '%' },
};

const format = (digits: number, number: number) => {
    return Intl.NumberFormat('en', {
        maximumFractionDigits: digits,
        minimumFractionDigits: 0,
    }).format(number);
};

export function generateWeaponEmbed(id: string): EmbedBuilder {
    const embed = new EmbedBuilder();
    const weapon = weapons[id];
    const weaponMaterial = (
        weaponMaterials as { [key: string]: typeof weaponMaterials.alley_hunter }
    )[id];

    embed.setThumbnail(`https://paimon.moe/images/weapons/${id}.png`);
    embed.setTitle(weapon.name);
    embed.setDescription(weapon.description);
    if (
        weapon.skill.name !== undefined &&
    weapon.skill.description !== undefined
    ) {
        embed.addFields({ name: weapon.skill.name, value: weapon.skill.description
            .replace(/<span([^>+]*)>/g, '**')
            .replace(/<\/span[^>]*>/g, '**'), });
    }

    embed.addFields({ name: 'Type', value: weaponMaterial.type.name, inline: true });
    embed.addFields({ name: 'Rarity', value: `${weapon.rarity} ⭐`, inline: true });
    embed.addFields({ name: 'Source', value: `${weaponMaterial.source[0].toUpperCase()}${weaponMaterial.source.substring(1,)}`, inline: true });
    embed.addFields({ name: 'Base ATK', value: format(0, Number(weapon.atk[weapon.atk.length - 1])), inline: true });
    if (
        weapon.secondary.name !== undefined &&
    weapon.secondary.stats !== undefined
    ) {
        embed.addFields({ name: 'Secondary Stat', value: `${secondary[weapon.secondary.name].name} ${format(1, (weapon.secondary.stats[weapon.secondary.stats.length - 1] ?? 0) *
          secondary[weapon.secondary.name].multiplier,)}${secondary[weapon.secondary.name].suffix}`, inline: true });
    }
    embed.addFields({ name: '\u200B', value: '\u200B', inline: true });

    const ascension = weaponMaterial.ascension[0].items
        .map((e: any) => `${itemGroup[e.item.id].name}`)
        .join(' \u200B \u200B ');
    embed.addFields({ name: 'Ascensions Material', value: ascension });
    embed.setFooter({ text: '※ Stats numbers are at max level' });

    return embed;
}