module.exports = (client: any, error: any) => {
    client.logger.error(error.message);
};
