const express = require('express');
const router = express.Router();
const adminCont = require('../controllers/admin');

const userauthentication = require('../middleware/auth')

router.get('/add_peoples', userauthentication.authenticate, adminCont.findeveryusers);
router.post('/remove_oldpeople', userauthentication.authenticate, adminCont.removeOldpeople);
router.post('/add_newpeople', userauthentication.authenticate, adminCont.addNewpeople);
router.post('/change_name', adminCont.changegroupname);

module.exports = router;