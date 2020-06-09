module.exports = (client: any) => {
    console.log('  [-] Initialize console');

    const promp = process.openStdin();
    promp.addListener('data', (res) => {
        const x = res.toString().trim().split(/ +/g);
        client.bot.channels.cache.get('713324629967634502').send(x.join(' ')); // bot-console
    });

    console.log('  [V] Done!');
};