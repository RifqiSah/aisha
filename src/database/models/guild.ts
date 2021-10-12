import { Sequelize, DataTypes } from 'sequelize';

const Guild = {
    name: 'guild',
    define: {
        guildId: {
            type: DataTypes.STRING,
        },
        guildName: {
            type: DataTypes.STRING,
        },
    },
    options: {
        timestamps: true,
    }
};

module.exports = (sequelize: Sequelize) => {
    const { name, define, options } = Guild;
    return sequelize.define(name, define, options);
};