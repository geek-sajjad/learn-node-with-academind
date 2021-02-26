const Product = require('../models/product');

exports.getProducts = (req, res, next) => {
    Product.fetchAll((products) => {
        res.render('admin/products', { docTitle: 'Admin | Products', path: '/admin/products', prods: products });
    });

};

exports.getAddProduct = (req, res, next) => {
    res.render('admin/add-product', { docTitle: 'Admin | Add Product', path: '/admin/add-product' });
};

exports.postAddProduct = (req, res, next) => {
    const title = req.body.title;
    const price = req.body.price;
    const description = req.body.description;
    const imageUrl = req.body.imageUrl;

    const product = new Product(title, imageUrl, description, price);
    product.save();
    res.redirect('/');
};