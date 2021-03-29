const bcrypt = require('bcryptjs');
const nodeMailer = require('nodemailer');
const sendGridTransport = require('nodemailer-sendgrid-transport');
const {
    validationResult
} = require('express-validator');
const crypto = require('crypto');

const User = require('../models/user');
const transporter = nodeMailer.createTransport(sendGridTransport({
    auth: {
        api_key: process.env.SENDGRID_KEY
    }
}));

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
            }).catch(e => {
                const error = new Error(e);
                next(error);
            });
        })
        .catch(e => {
            const error = new Error(e);
            next(error);
        });
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
            // transporter.sendMail({
            //     to: email,
            //     from: 'info@node.shop@node-academind.dev',
            //     subject: 'your signup is done',
            //     html: '<h1> You successfully signed up'
            // });
            res.redirect('/login');
        })
        .catch(e => {
            const error = new Error(e);
            next(error);
        });
}

exports.getReset = (req, res, next) => {
    let message = req.flash('error');
    if (message.length > 0) {
        message = message[0];
    } else {
        message = null;
    }
    res.render('auth/reset', {
        docTitle: 'Reset Password',
        path: '/reset',
        isAuthenticated: req.session.isLoggedIn,
        errorMessage: message,
        validationErrors: [],
        oldInput: {
            email: '',
        }
    });
}

exports.postReset = (req, res, next) => {
    crypto.randomBytes(32, (err, buffer) => {
        if (err) {
            console.log(err);
            res.redirect('/reset');
        }
        const token = buffer.toString('hex');
        User.findOne({
                email: req.body.email
            })
            .then(user => {
                if (!user) {
                    req.flash('error', 'no user found with that email');
                    return res.redirect('/reset');
                }
                user.resetToken = token;
                user.resetTokenExpiration = Date.now() + 3600000;
                return user.save();
            })
            .then(result => {
                transporter.sendMail({
                    to: req.body.email,
                    from: 'test@test.com',
                    subject: 'Reset Password',
                    html: `
                    <p>Reset your password using this <a href="http://localhost:3000/reset/${token}">link</a></p>
                `
                });
                res.redirect('/reset');

            })
            .catch(e => {
                const error = new Error(e);
                next(error);
            });
    });
}

exports.getNewPassword = (req, res, next) => {
    const token = req.params.token;

    User.findOne({
            resetToken: token,
            resetTokenExpiration: {
                $gt: Date.now()
            }
        })
        .then(user => {
            if (!user) {
                req.flash('error', 'Link is Expired');
                return res.redirect('/reset');
            }
            let message = req.flash('error');
            if (message.length > 0) {
                message = message[0];
            } else {
                message = null;
            }
            res.render('auth/new-password', {
                docTitle: 'New Password',
                path: '/new-password',
                isAuthenticated: req.session.isLoggedIn,
                errorMessage: message,
                validationErrors: [],
                oldInput: {
                    email: '',
                },
                userId: user._id.toString(),
                passwordToken: token
            });
        }).catch(e => {
            const error = new Error(e);
            next(error);
        });
}

exports.postNewPassword = (req, res, next) => {
    const userId = req.body.userId;
    const passwordToken = req.body.passwordToken;
    const newPassword = req.body.password;
    let resetUser;

    User.findOne({
            _id: userId,
            resetToken: passwordToken,
            resetTokenExpiration: {
                $gt: Date.now()
            }
        }).then(user => {
            if (!user) {
                throw Error('user not found!');
                // return Promise.reject('user not found!');
            }
            resetUser = user;
            return bcrypt.hash(newPassword, 12);
        })
        .then(hashedPassword => {
            resetUser.password = hashedPassword;
            resetUser.resetToken = undefined;
            resetUser.resetTokenExpiration = undefined;
            return resetUser.save();
        }, )
        .then(result => {
            res.redirect('/login');
        })
        .catch(e => {
            const error = new Error(e);
            next(error);
        });
}