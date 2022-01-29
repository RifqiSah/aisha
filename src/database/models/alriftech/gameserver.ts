import { Sequelize, DataTypes } from 'sequelize';

const GameServer = {
    name: 'game_server',
    define: {
        game: {
            type: DataTypes.STRING,
        },
        shortName: {
            type: DataTypes.STRING,
        },
        longName: {
            type: DataTypes.STRING,
        },
        version: {
            type: DataTypes.INTEGER,
        },
        server: {
            type: DataTypes.INTEGER,
        },
        berita: {
            type: DataTypes.INTEGER,
        },
        patchNote: {
            type: DataTypes.INTEGER,
        },
        ip: {
            type: DataTypes.STRING,
        },
    },
    options: {
        timestamps: true,
        createdAt: 'created_at',
        updatedAt: 'updated_at',
    }
};

module.exports = (sequelize: Sequelize) => {
    const { name, define, options } = GameServer;
    return sequelize.define(name, define, options);
};