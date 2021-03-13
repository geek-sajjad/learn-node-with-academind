const User = require('../models/user');

exports.getLogin = (req, res, next) => {
    console.log(req.session.isLoggedIn);
    res.render('auth/login', {
        docTitle: 'login',
        path: '/login',
        isAuthenticated: req.session.isLoggedIn
    });
}

exports.postLogIn = (req, res, next) => {
    User.findById('604a3a095ea61b102d78b3fc').then(user => {
        req.session.isLoggedIn = true;
        req.session.user = user;
        req.session.save((err) => {
            res.redirect('/');
        });
    }).catch(e => console.log(e));
}

exports.postLogOut = (req, res, next) => {
    req.session.destroy(err => {
        console.log(err);
        res.redirect('/');
    });
}