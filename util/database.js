const Sequelize = require('sequelize');

const sequelize = new Sequelize('academind', 'root', process.env.MYSQL_PASSWORD, {
    dialect: 'mysql'
});

module.exports = sequelize;