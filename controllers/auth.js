const bcrypt = require('bcryptjs');
const {
    validationResult
} = require('express-validator');

const User = require('../models/user');

exports.getLogin = (req, res, next) => {
    let message = req.flash('error');
    if (message.length > 0) {
        message = message[0];
    } else {
        message = null;
    }
    res.render('auth/login', {
        docTitle: 'login',
        path: '/login',
        isAuthenticated: req.session.isLoggedIn,
        errorMessage: message,
        validationErrors: [],
        oldInput: {
            email: '',
            password: ''
        }
    });
}

exports.postLogIn = (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(402).render('auth/login', {
            docTitle: 'login',
            path: '/login',
            isAuthenticated: req.session.isLoggedIn,
            errorMessage: errors.array()[0].msg,
            validationErrors: [],
            oldInput: {
                email: req.body.email,
                password: req.body.password
            }
        });
    }
    const email = req.body.email;
    const password = req.body.password;
    User.findOne({
            email: email
        }).then(user => {
            if (!user) {
                return res.render('auth/login', {
                    docTitle: 'login',
                    path: '/login',
                    isAuthenticated: req.session.isLoggedIn,
                    errorMessage: 'email or password is invalid',
                    validationErrors: [],
                    oldInput: {
                        email: req.body.email,
                        password: req.body.password
                    }
                });
            }
            bcrypt.compare(password, user.password).then(doMatch => {
                if (doMatch) {
                    req.session.isLoggedIn = true;
                    req.session.user = user;
                    req.session.save((err) => {
                        res.redirect('/');
                    });
                } else {
                    return res.render('auth/login', {
                        docTitle: 'login',
                        path: '/login',
                        isAuthenticated: req.session.isLoggedIn,
                        errorMessage: 'email or password is invalid',
                        validationErrors: [],
                        oldInput: {
                            email: req.body.email,
                            password: req.body.password
                        }
                    });
                }
            }).catch(e => console.log(e));
        })
        .catch(e => console.log(e));
}

exports.postLogOut = (req, res, next) => {
    req.session.destroy(err => {
        if (err) {
            console.log(err);
        }
        res.redirect('/');
    });
}

exports.getSignup = (req, res, next) => {
    let message = req.flash('error');
    if (message.length > 0) {
        message = message[0];
    } else {
        message = null;
    }
    res.render('auth/signup', {
        docTitle: 'signup',
        path: '/signup',
        isAuthenticated: false,
        errorMessage: message,
        oldInput: {
            password: '',
            confirmPassword: '',
            email: ''
        },
        validationErrors: []
    });
}

exports.postSignup = (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(402).render('auth/signup', {
            docTitle: 'signup',
            path: '/signup',
            isAuthenticated: false,
            errorMessage: errors.array()[0].msg,
            oldInput: {
                password: req.body.password,
                confirmPassword: req.body.confirmPassword,
                email: req.body.email
            },
            validationErrors: errors.array(),
        });
    }
    const email = req.body.email;
    const password = req.body.password;

    bcrypt.hash(password, 12)
        .then(hashedPassword => {
            const user = new User();
            user.email = email;
            user.password = hashedPassword;
            user.cart = {
                items: []
            };
            return user.save();
        }).then(result => {
            res.redirect('/login');
        })
        .catch(e => console.log(e));
}