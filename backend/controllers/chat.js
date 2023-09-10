const Chat = require('../models/chat');
const User = require('../models/users');
const Group = require('../models/groups');


exports.insertchats = async (req, res) => {
    const token_group_id = req.header('Group-ID');
    const { message} = req.body;
    await Chat.create({ message, sender_name: req.user.name, userId: req.user.id, groupId: token_group_id })
        .then(message => {
            return res.status(201).json({message, success: true } );
    }).catch(err => {
        return res.status(403).json({success : false, error: err})
    })
};


exports.getAllchats = async (req, res) => {
    const token_group_id = req.header('Group-ID');
    try {
        const isAdmin = await checkIfUserIsAdmin(token_group_id, req.user.id);

        const message = await Chat.findAll({
            where: {
                groupId: token_group_id
            },
            include: [{ model: User, attributes: ['name'] }],
            order: [['createdAt', 'ASC']]
        });
        const obj1 = {
            userName: req.user.name,
            messages: message,
            isAdmin: isAdmin
        };
        res.status(200).json(obj1);

    } catch (err) {
        console.error(err);
        res.status(500).send('Error fetching messages.');
    }
};


async function checkIfUserIsAdmin(token_group_id, userId) {
    const group = await Group.findByPk(token_group_id);

    if (!group) {
        return false;
    }
    return group.userId === userId;
}



