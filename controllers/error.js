exports.get404 = (req, res, next) => {
    res.status(400).render('404', {
        docTitle: '404',
        path: '',
        isAuthenticated: req.session.isLoggedIn
    });
};

exports.get500 = (err, req, res, next) => {
    res.status(500).render('500', {
        docTitle: '500',
        path: '',
        isAuthenticated: req.session.isLoggedIn
    });
};