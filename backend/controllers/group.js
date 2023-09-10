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
        const selectedUserId = selectedUsers.map(user => user.id);
        const userNamesString = [req.user.name, ...selectedUserNames].join(', '); 
        const memberIds = [req.user.id, ...selectedUserId];

        await group.update({ member_names: userNamesString, member_ids: JSON.stringify(memberIds) });
        res.status(201).send('Group created successfully.');
    } catch (err) {
        console.error(err);
        res.status(500).send('Error creating group.');
    }
};

exports.findgroups = async (req, res) => {
    try {
        const groups = await Group.findAll();
        const filteredGroups = groups.filter(group => {
            return group.member_names.includes(req.user.name);
        });
        res.status(200).json(filteredGroups);

    } catch (err) {
        console.error(err);
        res.status(500).send('Error fetching Groups.');
    }
};