const Product = require('../models/product');

exports.getProducts = (req, res, next) => {
    res.render('admin/products', { docTitle: 'Admin | Products', path: '/admin/products' });
};

exports.getAddProduct = (req, res, next) => {
    res.render('admin/add-product', { docTitle: 'Admin | Add Product', path: '/admin/add-product' });
};

exports.postAddProduct = (req, res, next) => {
    const product = new Product(req.body.title);
    product.save();
    res.redirect('/');
};