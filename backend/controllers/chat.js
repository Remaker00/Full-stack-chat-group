const Chat = require('../models/chat');
const User = require('../models/users');
const Group = require('../models/groups');


exports.insertchats = async (req, res) => {
    const { message } = req.body;
    const groupId = req.headers['group-id'];
    const existingGroup = await Group.findOne({ _id: groupId });

    try {
        const chat = new Chat({
            message,
            sender_name: req.user.name,
            user: {
                name: req.user.name,
                userId: req.user._id
            },
            group: {
                name: existingGroup.name,
                groupId: groupId
            },
        });

        await chat.save();

        res.status(201).json({ message: chat.message, success: true });
    }
    catch (err) {
        console.error(err);
        res.status(403).json({ success: false, error: err });
    }
};


exports.getAllchats = async (req, res) => {
    const groupId = req.headers['group-id'];
    try {
        const isAdmin = await checkIfUserIsAdmin(groupId, req.user._id);

        const messages = await Chat.find({ 'group.groupId': groupId })
            .populate('user', 'name')
            .sort({ timestamp: 1 });

        const obj1 = {
            userName: req.user.name,
            messages: messages,
            isAdmin: isAdmin,
        };

        res.status(200).json(obj1);
    }

    catch (err) {
        console.error(err);
        res.status(500).send('Error fetching messages.');
    }
};


async function checkIfUserIsAdmin(groupId, userId) {
    try {
        const group = await Group.findById(groupId);

        if (!group) {
            return false;
        }
        return group.user.userId.equals(userId);
    } catch (err) {
        console.error(err);
        return false;
    }
}



