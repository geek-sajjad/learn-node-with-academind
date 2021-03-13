const express = require('express');
const router = express.Router();
const authController = require('../controllers/auth');

router.get('/login', authController.getLogin);
router.post('/login', authController.postLogIn);
router.post('/logout', authController.postLogOut);

module.exports = router;