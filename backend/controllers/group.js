const Group = require('../models/groups');
const User = require('../models/users');

exports.insertgroups = async (req, res) => {
    const { selectedUserIds, name } = req.body;
    try {
        const group = await Group.create({ name,  userId: req.user.id  });

        const selectedUsers = await User.findAll({
            where: {
                id: selectedUserIds,
            },
        });

        await group.addUsers(selectedUsers);
        const selectedUserNames = selectedUsers.map(user => user.name);
        const userNamesString = selectedUserNames.join(', '); 

        await group.update({ member_names: userNamesString });
        res.status(201).send('Group created successfully.');
    } catch (err) {
        console.error(err);
        res.status(500).send('Error creating group.');
    }
};

exports.findgroups = async (req, res) => {
    try {
        const groups = await Group.findAll({
            where: {
                userId: req.user.id
            }
        });
        res.status(200).json(groups);

    } catch (err) {
        console.error(err);
        res.status(500).send('Error fetching messages.');
    }
};