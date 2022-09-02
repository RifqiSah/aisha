import { EmbedBuilder } from 'discord.js';
import { artifacts } from './data/artifacts';

export function generateArtifactEmbed(id: string): EmbedBuilder {
    const embed = new EmbedBuilder();
    const artifact = artifacts[id];

    embed.setThumbnail(`https://paimon.moe/images/artifacts/${id}_flower.png`);
    embed.setTitle(artifact.name);

    const descriptions = [];
    for (let i = 0; i < artifact.bonuses.length; i++) {
        const bonus = artifact.bonuses[i];
        descriptions.push(`**${artifact.setPiece[i]} Piece Bonus**: ${bonus}`);
    }

    embed.setDescription(descriptions.join('\n'));
    embed.addFields({ name: 'Rarity', value : `${artifact.rarity.join('/')} ⭐` });

    return embed;
}