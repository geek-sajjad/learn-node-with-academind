const bcrypt = require('bcryptjs');

const User = require('../models/user');

exports.getLogin = (req, res, next) => {
    res.render('auth/login', {
        docTitle: 'login',
        path: '/login',
        isAuthenticated: req.session.isLoggedIn
    });
}

exports.postLogIn = (req, res, next) => {
    const email = req.body.email;
    const password = req.body.password;

    User.findOne({
            email: email
        }).then(user => {
            if (!user) {
                return res.redirect('/login');
            }
            return bcrypt.compare(password, user.password).then(doMatch => {
                if (doMatch) {
                    req.session.isLoggedIn = true;
                    req.session.user = user;
                    req.session.save((err) => {
                        res.redirect('/');
                    });
                } else {
                    res.redirect('/login');
                }
            });
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
    res.render('auth/signup', {
        docTitle: 'signup',
        path: '/signup',
        isAuthenticated: false
    });
}

exports.postSignup = (req, res, next) => {
    const email = req.body.email;
    const password = req.body.password;

    User.findOne({
        email: email
    }).then(userDoc => {
        if (userDoc) {
            res.redirect('/signup');
            return;
        }
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
            });

    }).catch(e => console.log(e));
}