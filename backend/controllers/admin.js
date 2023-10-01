const Sequelize = require('sequelize');
const User = require('../models/users');
const Group = require('../models/groups');

exports.findeveryusers = async (req, res) => {
    const groupId= req.headers['group-id'];
    try {
        const existingGroup = await Group.findOne({ _id: groupId });
        const currentUser = req.user.name;

        const memberNamesArray = existingGroup.member_names.split(',').map(name => name.trim());
    
        const newpeople = await User.find({
            name: {
                $nin: memberNamesArray,
            },
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
    const { name } = req.body;
    const groupId = req.headers['group-id'];

    try {
        const group = await Group.findById(groupId);

        if (name) {
            group.name = name;
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
    const groupId = req.headers['group-id'];

    try {
        const group = await Group.findById(groupId);

        const currentMembers = group.member_names.split(', ');

        const updatedMembers = currentMembers.filter(member => !selectedUserIds.includes(member));

        const updatedMemberNames = updatedMembers.join(', ');

        group.member_names = updatedMemberNames;

        group.member_ids = group.member_ids.filter(memberId => !selectedUserIds.includes(memberId));

        await group.save();

        res.status(201).send('User removed successfully.');
    } catch (err) {
        console.error(err);
        res.status(500).send('Error removing user.');
    }
};

exports.addNewpeople = async (req, res) => {
    const { selectedUserIds } = req.body;
    const groupId = req.headers['group-id'];
    console.log("><><><",groupId);

    try {
        const group = await Group.findById(groupId);

        if (!group) {
            return res.status(404).json({ error: 'Group not found' });
        }

        const currentMembers = group.member_ids.map(String);

        console.log("><><><",currentMembers);

        if (!Array.isArray(selectedUserIds) || selectedUserIds.length === 0) {
            return res.status(400).json({ error: 'Invalid selectedUserIds data' });
        }

        const alreadyMembers = selectedUserIds.filter(userId => currentMembers.includes(userId));

        console.log("><><><",alreadyMembers);

        if (alreadyMembers.length > 0) {
            return res.status(400).json({ error: 'One or more users are already members of the group' });
        }

        group.member_ids = group.member_ids.concat(selectedUserIds);

        console.log("><><><",group.member_ids);

        await group.save();

        res.status(201).send('Users added successfully.');
    } catch (err) {
        console.error(err);
        res.status(500).send('Error adding users.');
    }
};

