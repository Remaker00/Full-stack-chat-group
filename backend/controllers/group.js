const Group = require('../models/groups');
const User = require('../models/users');


exports.insertgroups = async (req, res) => {
    const { selectedUserIds, name } = req.body;
    try {
        const group = new Group({
            name,
            member_names: '',
            member_ids: [],
            user: {
                name: req.user.name,
                userId: req.user._id,
            },
        });

        const selectedUsers = await User.find({
            _id: { $in: selectedUserIds },
        });
        
        const selectedUserNames = selectedUsers.map(user => user.name);
        const selectedUserId = selectedUsers.map(user => user._id);

        group.member_names = [req.user.name, ...selectedUserNames].join(', '); 
        group.member_ids = [req.user.id, ...selectedUserId];

        await group.save();

        res.status(201).send('Group created successfully.');
    } catch (err) {
        console.error(err);
        res.status(500).send('Error creating group.');
    }
};

exports.findgroups = async (req, res) => {
    try {
        const groups = await Group.find({
            'member_ids': req.user._id,
        });

        res.status(200).json(groups);

    } catch (err) {
        console.error(err);
        res.status(500).send('Error fetching Groups.');
    }
};