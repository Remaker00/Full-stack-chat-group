const express = require('express');
const router = express.Router();
const adminCont = require('../controllers/user');

router.post('/signup', adminCont.insertusers);
router.post('/login', adminCont.checkusers);

module.exports = router;