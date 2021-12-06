module.exports = {
    name: 'reboot',
    func: async (client: any, message: any, args: any) => {
        try {
            await message.channel.send('Tunggu sebentar!').then((msg: any) => msg.delete({ timeout: 5000 })).catch((err: any) => {
                client.logger.error(err);
            });
            process.exit();
        } catch (e: any) {
            message.channel.send(`ERROR: ${e.message}`);
        }
    }
};