import { Sequelize, DataTypes } from 'sequelize';

const GameNews = {
    name: 'game_news',
    define: {
        name: {
            type: DataTypes.STRING,
        },
        news: {
            type: DataTypes.INTEGER,
        },
        other: {
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
    const { name, define, options } = GameNews;
    return sequelize.define(name, define, options);
};