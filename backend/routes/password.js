const express = require('express');
const router = express.Router();
const passCont = require('../controllers/password');

router.post('/send_mail', passCont.sendTransactionalEmail);

module.exports = router;