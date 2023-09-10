const Sequelize = require('sequelize');
const User = require('../models/users');
const Group = require('../models/groups');

exports.findeveryusers = async (req, res) => {
    const token_group_id = req.header('Group-ID');
    try {
        const existingGroup = await Group.findByPk(token_group_id);
        const currentUser = req.user.name;

        const memberNamesArray = existingGroup.member_names.split(',').map(name => name.trim());
    
        const newpeople = await User.findAll({
            where: {
                name: {
                [Sequelize.Op.notIn]: memberNamesArray
                },
            }
        });

        const newpeopleArray = newpeople.map(person => person.toJSON());

        const currentUserIndex = memberNamesArray.indexOf(currentUser);
        if (currentUserIndex !== -1) {
            memberNamesArray.splice(currentUserIndex, 1);
        }

        const responseData = {
            oldpeople: memberNamesArray,
            newpeople: newpeopleArray
        };
        
        res.status(200).json(responseData);

    } catch (err) {
        console.error(err);
        res.status(500).send('Error fetching peoples.');
    }
};

exports.changegroupname = async (req, res) => {
    const names = req.body;
    const token_group_id = req.header('Group-ID');

    try {
        const group = await Group.findByPk(token_group_id);

        if(names.name) {
            group.name = names.name;
            await group.save();
        }

        res.status(201).send('Name changed successfully.');
    } catch (err) {
        console.error(err);
        res.status(500).send('Error changing name.');
    }
};

exports.removeOldpeople = async (req, res) => {
    const { selectedUserIds } = req.body;
    const token_group_id = req.header('Group-ID');

    try {
        const group = await Group.findByPk(token_group_id);

        const currentMembers = group.member_names.split(', ');

        const updatedMembers = currentMembers.filter(member => !selectedUserIds.includes(member));

        const updatedMemberNames = updatedMembers.join(', ');

        group.member_names = updatedMemberNames;

        await group.save();

        res.status(201).send('User removed successfully.');
    } catch (err) {
        console.error(err);
        res.status(500).send('Error creating group.');
    }
};

exports.addNewpeople = async (req, res) => {
    const { selectedUserIds } = req.body;
    const userId = parseInt(selectedUserIds[0]);
    const token_group_id = req.header('Group-ID');

    try {
        const group = await Group.findByPk(token_group_id);
        const user = await User.findByPk(userId);

        const currentMembers = group.member_names.split(', ');

        if (!currentMembers.includes(user.name)) {
            currentMembers.push(user.name);
        } else {
            return res.status(400).json({ error: 'User is already a member of the group' });
        }

        const updatedMemberNames = currentMembers.join(', ');

        group.member_names = updatedMemberNames;

        await group.save();

        res.status(201).send('User removed successfully.');
    } catch (err) {
        console.error(err);
        res.status(500).send('Error creating group.');
    }
};

