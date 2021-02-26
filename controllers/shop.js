const Product = require('../models/product');

exports.getIndex = (req, res, next) => {
    res.render('shop/index', { docTitle: 'Shop', path: '/' });
};

exports.getCart = (req, res, next) => {
    res.render('shop/cart', { docTitle: 'Cart', path: '/cart' });
};

exports.getProducts = (req, res, next) => {
    Product.fetchAll((products) => {
        res.render('shop/products-list', { docTitle: 'Products', products: products, path: '/products' });
    });
};