const Product = require('../models/product');

exports.getProducts = (req, res, next) => {
    Product.find({
        userId: req.user._id
    }).then(products => {
        res.render('admin/products', {
            docTitle: 'Admin | Products',
            path: '/admin/products',
            prods: products,
            isAuthenticated: req.session.isLoggedIn
        });
    }).catch(e => console.log(e));
};

exports.getAddProduct = (req, res, next) => {
    res.render('admin/edit-product', {
        docTitle: 'Admin | Add Product',
        editingMode: false,
        path: '/admin/add-product',
        isAuthenticated: req.session.isLoggedIn
    });
};

exports.postAddProduct = (req, res, next) => {
    const title = req.body.title;
    const price = req.body.price;
    const description = req.body.description;
    const imageUrl = req.body.imageUrl;

    const product = new Product({
        title,
        price,
        description,
        imageUrl,
        userId: req.user._id,
    });
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
    Product.findById(prodId).then(product => {
        if (!product) {
            res.redirect('/');
            return;
        }
        res.render('admin/edit-product', {
            docTitle: 'Admin | Edit Product',
            product,
            path: '/admin/edit-product',
            editingMode,
            isAuthenticated: req.session.isLoggedIn
        });
    }).catch(e => console.log(e));
};

exports.postEdiProduct = (req, res, next) => {
    const prodId = req.body.productId;
    const updatedTitle = req.body.title;
    const updatedPrice = req.body.price;
    const updatedDescription = req.body.description;
    const updatedImageUrl = req.body.imageUrl;
    Product.findById(prodId).then(product => {
            if (product.userId.toString() !== req.user._id.toString()) {
                return res.redirect('/');
            }
            product.title = updatedTitle;
            product.price = updatedPrice;
            product.description = updatedDescription;
            product.imageUrl = updatedImageUrl;
            product.userId = req.user._id;
            return product.save().then(result => {
                res.redirect('/admin/products');
            });
        })
        .catch(e => console.log(e));
};

exports.postDeleteProduct = (req, res, next) => {
    const prodId = req.body.productId;
    Product.deleteOne({
        _id: prodId,
        userId: req.user._id
    }).then(result => {
        res.redirect('/admin/products');
    }).catch(e => console.log(e));
};