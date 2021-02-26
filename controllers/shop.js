const Product = require('../models/product');

exports.getIndex = (req, res, next) => {
    Product.fetchAll((products) => {
        res.render('shop/index', { docTitle: 'Shop', path: '/', products: products });
    });
};

exports.getCart = (req, res, next) => {
    res.render('shop/cart', { docTitle: 'Cart', path: '/cart' });
};

exports.getOrders = (req, res, next) => {
    res.render('shop/orders', { docTitle: 'Orders', path: '/orders' });
};

exports.getProducts = (req, res, next) => {
    Product.fetchAll((products) => {
        res.render('shop/products-list', { docTitle: 'Products', products: products, path: '/products' });
    });
};