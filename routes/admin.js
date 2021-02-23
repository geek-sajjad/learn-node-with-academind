const path = require('path');

const express = require('express');

const router = express.Router();

const products = [];

router.get('/add-product', (req, res, next) => {
    // res.sendFile(path.join(__dirname, '..', 'views', 'add-product.html'));
    res.render('add-product', { docTitle: 'Add Product' });
});

router.post('/add-product', (req, res, next) => {
    console.log(req.body);
    products.push({ title: req.body.title });
    res.redirect('/');
});
module.exports.router = router;
module.exports.products = products;