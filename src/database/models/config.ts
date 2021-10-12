import { Sequelize, DataTypes } from 'sequelize';

const Config = {
    name: 'config',
    define: {
        guildId: {
            type: DataTypes.STRING,
        },
        key: {
            type: DataTypes.STRING,
        },
        value: {
            type: DataTypes.STRING,
        },
        desc: {
            type: DataTypes.STRING,
        },
    },
    options: {
        timestamps: true,
    }
};

module.exports = (sequelize: Sequelize) => {
    const { name, define, options } = Config;
    return sequelize.define(name, define, options);
};