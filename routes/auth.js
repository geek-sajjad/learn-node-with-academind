const express = require('express');
const {
    check
} = require('express-validator');
const router = express.Router();
const User = require('../models/user');
const authController = require('../controllers/auth');

router.get('/login', authController.getLogin);
router.post('/login', [
    check('email', 'Please enter a valid email.').isEmail(),
    check('password', 'Please enter password at least 5 charachter and alpahnumric').isLength({
        min: 5
    }).isAlphanumeric()
], authController.postLogIn);
router.get('/signup', authController.getSignup);
router.post('/signup', [
    check('email').isEmail().withMessage('Please enter a valid email.')
    .custom((value, {
        req
    }) => {
        return User.findOne({
            email: value
        }).then(userDoc => {
            if (userDoc) {
                return Promise.reject('email is already exsist - please pick one that not exsist');
            }
        })
    }),
    check('password', 'Please enter password at least 5 charachter and alpahnumric')
    .isLength({
        min: 5
    })
    .isAlphanumeric(),
    check('confirmPassword').custom((value, {
        req
    }) => {
        if (value !== req.body.password) {
            throw new Error('Password dose not match');
        }
        return true;
    })
], authController.postSignup);
router.post('/logout', authController.postLogOut);

module.exports = router;