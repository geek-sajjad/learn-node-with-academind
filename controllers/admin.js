const Product = require('../models/product');

exports.getProducts = (req, res, next) => {
    Product.fetchAll().then(products => {
        res.render('admin/products', { docTitle: 'Admin | Products', path: '/admin/products', prods: products });
    }).catch(e => console.log(e));
};

exports.getAddProduct = (req, res, next) => {
    res.render('admin/edit-product', { docTitle: 'Admin | Add Product', editingMode: false, path: '/admin/add-product' });
};

exports.postAddProduct = (req, res, next) => {
    const title = req.body.title;
    const price = req.body.price;
    const description = req.body.description;
    const imageUrl = req.body.imageUrl;

    const product = new Product(title, price, imageUrl, description, req.user._id);
    product.save()
        .then(result => {
            res.redirect('/');
        })
        .catch(e => console.log(e));
}

exports.getEdiProduct = (req, res, next) => {
    const editingMode = req.query.editing
    const prodId = req.params.productId;
    if (!editingMode) {
        return res.redirect('/');
    }
    Product.getProduct(prodId).then(product => {
        if (!product) {
            res.redirect('/');
            return;
        }
        res.render('admin/edit-product', {
            docTitle: 'Admin | Edit Product',
            product,
            path: '/admin/edit-product',
            editingMode
        });
    }).catch(e => console.log(e));
};

exports.postEdiProduct = (req, res, next) => {
    const prodId = req.body.productId;
    const updatedTitle = req.body.title;
    const updatedPrice = req.body.price;
    const updatedDescription = req.body.description;
    const updatedImageUrl = req.body.imageUrl;

    Product.updateProduct(prodId, updatedTitle, updatedPrice, updatedDescription, updatedImageUrl)
        .then(result => {
            res.redirect('/admin/products');
        }).catch(e => console.log(e));

};

exports.postDeleteProduct = (req, res, next) => {
    const prodId = req.body.productId;
    Product.deleteProduct(prodId).then(result => {
        res.redirect('/admin/products');
    }).catch(e => console.log(e));
};