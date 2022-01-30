import { Sequelize, DataTypes } from 'sequelize';

const Channel = {
    name: 'channel',
    define: {
        guildId: {
            type: DataTypes.STRING,
        },
        channelId: {
            type: DataTypes.STRING,
        },
        channelName: {
            type: DataTypes.STRING,
        },
    },
    options: {
        timestamps: true,
    }
};

module.exports = (sequelize: Sequelize) => {
    const { name, define, options } = Channel;
    return sequelize.define(name, define, options);
};