const express = require('express');
const router = express.Router();
const adminCont = require('../controllers/group');

const userauthentication = require('../middleware/auth')

router.post('/', userauthentication.authenticate,adminCont.insertgroups);
router.get('/message', userauthentication.authenticate,adminCont.findgroups);

module.exports = router;