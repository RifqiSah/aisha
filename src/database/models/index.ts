import { Sequelize } from 'sequelize';
// import { createWriteStream  } from 'fs';

// const logStream = createWriteStream('./logs/sql.log', { 'flags': 'a+' });

const sequelize = new Sequelize(process.env.DB_NAME || '', process.env.DB_USER || '', process.env.DB_PASSWORD || '', {
    host: process.env.DB_HOST,
    dialect: 'mysql',
    pool: {
        max: 5,
        min: 0,
        acquire: 30000,
        idle: 10000,
    },
    logging: process.env.NODE_ENV === 'development',
    // logging: msg => logStream.write(msg + '\r\n'),
});

const db: any = {
    adapter: null,
};

db.adapter = sequelize;

// Models
db.ChannelModel = require('./channel.js')(sequelize);
db.ConfigModel = require('./config.js')(sequelize);
db.GuildModel = require('./guild.js')(sequelize);
db.PointModel = require('./point.js')(sequelize);
db.GlobalsModel = require('./globals.js')(sequelize);

module.exports = db;