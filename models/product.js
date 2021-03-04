const { Sequelize } = require('sequelize');
const Sequlize = require('sequelize');
const sequlize = require('../util/database');

const Product = sequlize.define('product', {
    id: {
        type: Sequlize.INTEGER,
        autoIncrement: true,
        allowNull: false,
        primaryKey: true
    },
    title: {
        type: Sequlize.STRING,
    },
    price: {
        type: Sequlize.DOUBLE,
        allowNull: false
    },
    description: {
        type: Sequelize.STRING,
        allowNull: false
    },
    imageUrl: {
        type: Sequelize.STRING,
        allowNull: false
    }
});

module.exports = Product;