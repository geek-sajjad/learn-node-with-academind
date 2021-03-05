const Product = require('../models/product');

exports.getProducts = (req, res, next) => {
    req.user.getProducts().then(products => {
        res.render('admin/products', { docTitle: 'Admin | Products', path: '/admin/products', prods: products });
    }).catch(err => console.log(err));
};

exports.getAddProduct = (req, res, next) => {
    res.render('admin/edit-product', { docTitle: 'Admin | Add Product', editingMode: false, path: '/admin/add-product' });
};

exports.postAddProduct = (req, res, next) => {
    const title = req.body.title;
    const price = req.body.price;
    const description = req.body.description;
    const imageUrl = req.body.imageUrl;

    req.user.createProduct({
        title,
        price,
        description,
        imageUrl
    }).then((result) => {
        res.redirect('/');
    }).catch(err => {
        console.log(err);
    });
}

exports.getEdiProduct = (req, res, next) => {
    const editingMode = req.query.editing
    const prodId = req.params.productId;
    req.user.getProducts({ where: { id: prodId } })

    .then(products => {
            const product = products[0];
            if (!product) {
                res.redirect('/');
            }
            res.render('admin/edit-product', {
                docTitle: 'Admin | Edit Product',
                product,
                path: '/admin/edit-product',
                editingMode
            });
        })
        .catch(e => console.log(e));
};

exports.postEdiProduct = (req, res, next) => {
    const prodId = req.body.productId;
    const updatedTitle = req.body.title;
    const updatedPrice = req.body.price;
    const updatedDescription = req.body.description;
    const updatedImageUrl = req.body.imageUrl;
    req.user.getProducts({ where: { id: prodId } })
        .then(products => {
            const product = products[0];
            product.title = updatedTitle;
            product.imageUrl = updatedImageUrl;
            product.description = updatedDescription;
            product.price = updatedPrice;
            return product.save();
        })
        .then(result => {
            console.log('Updated successfully');
            res.redirect('/admin/products');
        })
        .catch(e => console.log(e));

};

exports.postDeleteProduct = (req, res, next) => {
    const prodId = req.body.productId;
    req.user.getProducts({ where: { id: prodId } })

    .then(products => {
        const product = products[0];
        return product.destroy();
    }).then(result => {
        res.redirect('/admin/products');
    }).catch(e => console.log(e));
};