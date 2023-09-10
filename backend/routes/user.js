const express = require('express');
const router = express.Router();
const adminCont = require('../controllers/user');

const userauthentication = require('../middleware/auth')

router.post('/signup', adminCont.insertusers);
router.post('/login', adminCont.checkusers);
router.get('/peoples', userauthentication.authenticate, adminCont.findAllusers);
router.get('/add_peoples', userauthentication.authenticate, adminCont.findAllusers);

module.exports = router;