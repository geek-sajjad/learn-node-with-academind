exports.get404 = (req, res, next) => {
    res.status(400).render('404', { docTitle: '404', path: '' });
};