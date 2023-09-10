const Sequelize = require('sequelize');
const sequelize = require('../util/dataB');

const Group = sequelize.define('groups', {
    name: Sequelize.STRING,
    member_names: Sequelize.STRING,
    member_ids: {
        type: Sequelize.JSON, // Use JSON data type to store an array
        allowNull: true,
        defaultValue: [], // Initialize it as an empty array
    },
});

module.exports = Group;