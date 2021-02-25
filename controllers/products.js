const Product = require('../models/product');

exports.getAddProduct = (req, res, next) => {
    // res.sendFile(path.join(__dirname, '..', 'views', 'add-product.html'));
    res.render('admin/add-product', { docTitle: 'Add Product', path: '/admin/add-product' });
};

exports.postAddProduct = (req, res, next) => {
    const product = new Product(req.body.title);
    product.save();
    res.redirect('/');
};

exports.getProduct = (req, res, next) => {
    res.render('admin/products', { docTitle: 'Admin Products', path: '/admin/products' });
};

exports.index = (req, res, next) => {
    res.render('shop/index', { docTitle: 'Shop', path: '/' });
};

exports.cart = (req, res, next) => {
    res.render('shop/cart', { docTitle: 'Cart', path: '/cart' });
};

exports.getProducts = (req, res, next) => {
    Product.fetchAll((products) => {
        res.render('shop/products-list', { docTitle: 'Products', products: products, path: '/products' });
    });
};