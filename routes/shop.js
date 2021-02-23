const path = require('path');

const express = require('express');

const router = express.Router();

const adminData = require('./admin');

router.get('/', (req, res, next) => {
    // res.sendFile(path.join(__dirname, '..', 'views', 'shop.html'));
    res.render('shop', { docTitle: 'Shop', products: adminData.products, path: '/' });
});

module.exports = router;