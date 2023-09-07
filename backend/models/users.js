const Sequelize = require('sequelize');
const sequelize = require('../util/dataB');

const User = sequelize.define('user', {
    name: Sequelize.STRING,
    email:  Sequelize.STRING,
    number:Sequelize.INTEGER,
    password: Sequelize.STRING,
});

module.exports = User;