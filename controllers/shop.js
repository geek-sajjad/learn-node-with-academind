const Product = require('../models/product');
const Cart = require('../models/cart');

exports.getIndex = (req, res, next) => {
    Product.fetchAll((products) => {
        res.render('shop/index', { docTitle: 'Shop', path: '/', prods: products });
    });
};

exports.getCart = (req, res, next) => {
    res.render('shop/cart', { docTitle: 'Cart', path: '/cart' });
};

exports.postCart = (req, res, next) => {
    const productId = req.body.productId;
    console.log(productId);
    Product.findById(productId, (product) => {
        Cart.addProduct(productId, product.price);
        res.redirect('/cart');
    });
};

exports.getOrders = (req, res, next) => {
    res.render('shop/orders', { docTitle: 'Orders', path: '/orders' });
};

exports.getProducts = (req, res, next) => {
    Product.fetchAll((products) => {
        res.render('shop/product-list', { docTitle: 'Products', prods: products, path: '/products' });
    });
};

exports.getProduct = (req, res, next) => {
    const productId = req.params.productId;
    Product.findById(productId, product => {
        res.render('shop/product-detail', { docTitle: 'Product Detail', product: product, path: '/products' });
    });
};