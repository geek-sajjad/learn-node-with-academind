const Product = require('../models/product');

exports.getProducts = (req, res, next) => {
    Product.fetchAll((products) => {
        res.render('admin/products', { docTitle: 'Admin | Products', path: '/admin/products', prods: products });
    });

};

exports.getAddProduct = (req, res, next) => {
    res.render('admin/edit-product', { docTitle: 'Admin | Add Product', editingMode: false, path: '/admin/add-product' });
};

exports.postAddProduct = (req, res, next) => {
    const title = req.body.title;
    const price = req.body.price;
    const description = req.body.description;
    const imageUrl = req.body.imageUrl;

    const product = new Product(null, title, imageUrl, description, price);
    product.save();
    res.redirect('/');
};

exports.getEdiProduct = (req, res, next) => {
    const editingMode = req.query.editing
    const prodId = req.params.productId;
    Product.findById(prodId, (product) => {
        if (!product) {
            res.redirect('/');
        }
        res.render('admin/edit-product', {
            docTitle: 'Admin | Edit Product',
            product,
            path: '/admin/edit-product',
            editingMode
        });
    });
};

exports.postEdiProduct = (req, res, next) => {
    const prodId = req.body.productId;
    const updatedTitle = req.body.title;
    const updatedPrice = req.body.price;
    const updatedDescription = req.body.description;
    const updatedImageUrl = req.body.imageUrl;
    const updatedProduct = new Product(prodId, updatedTitle, updatedImageUrl, updatedDescription, updatedPrice);
    updatedProduct.save();
    res.redirect('/admin/products');
};