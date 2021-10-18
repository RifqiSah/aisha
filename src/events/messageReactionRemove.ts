module.exports = async (client: any, reaction: any, user: any) => {
    // client.logger.info(`-> Pesan dari ${reaction.message.author.tag} dengan id '${reaction.message.id}' kehilangan reaction!`);

    if (reaction.message.partial) {
        try {
            await reaction.message.fetch();
        } catch (error) {
            client.logger.error('Terjadi error saat fetch pesan: ', error);
        }
    }

    if (reaction.partial) {
        try {
            await reaction.fetch();
        } catch (error) {
            client.logger.error('Terjadi error saat fetch reaction: ', error);
        }
    }

    // Filter emojinya
    const { message } = reaction;
    const { emoji } = reaction;

    const roles = [
        // general
        {
            e: '🇲',
            roleId: '668660316036530216',
            roleName: 'Mod DN Update',
        },
        {
            e: '🇹',
            roleId: '668680264096022550',
            roleName: 'Mod DN Tools',
        },
        // games
        {
            e: '1️⃣',
            roleId: '489292018628165633',
            roleName: 'Dragon Nest',
        },
        {
            e: '2️⃣',
            roleId: '776426142264721428',
            roleName: 'Monster Hunter World',
        },
        {
            e: '3️⃣',
            roleId: '496658639034122240',
            roleName: 'PUBG',
        },
        {
            e: '4️⃣',
            roleId: '853495757688274965',
            roleName: 'Black Desert Mobile',
        },
        {
            e: '5️⃣',
            roleId: '772004888112529419',
            roleName: 'Genshin Impact',
        },
        {
            e: '6️⃣',
            roleId: '802718208180092939',
            roleName: 'Minecraft',
        },
        {
            e: '7️⃣',
            roleId: '756162195468976339',
            roleName: 'Among Us',
        },
    ];

    roles.forEach((el: any) => {
        if (emoji.name === el.e) {
            message.guild.members.fetch(user.id).then((member: any) => {
                member.roles.remove(el.roleId);
            });
        }
    });
};
