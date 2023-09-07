const express = require('express');

const messageController = require('../controllers/chat')
const userauthentication = require('../middleware/auth')

const router = express.Router();

router.post('/', userauthentication.authenticate,  messageController.insertchats );
router.get('/', messageController.getAllchats );
router.delete('/:id', userauthentication.authenticate,  messageController.deletechats );

module.exports = router;