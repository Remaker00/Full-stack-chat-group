const express = require('express');
const router = express.Router();
const passCont = require('../controllers/resetpassword');

router.post('/pass_reset', passCont.resetpass);

module.exports = router;