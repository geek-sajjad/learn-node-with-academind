const Product = require('../models/product');
const Cart = require('../models/cart');

exports.getIndex = (req, res, next) => {
    Product.fetchAll()
        .then(([rows, filedData]) => {
            res.render('shop/index', { docTitle: 'Shop', path: '/', prods: rows });
        })
        .catch(err => {
            console.log(err);
        });
};

exports.getCart = (req, res, next) => {
    Cart.getCart(cart => {
        Product.fetchAll(products => {
            const cartProducts = [];
            for (product of products) {
                const cartProductData = cart.products.find(p => p.id === product.id);
                if (cartProductData) {
                    cartProducts.push({ productData: product, qty: cartProductData.qty });
                }
            }
            res.render('shop/cart', { docTitle: 'Cart', path: '/cart', products: cartProducts });
        });
    });
};

exports.postCart = (req, res, next) => {
    const productId = req.body.productId;
    Product.findById(productId, (product) => {
        Cart.addProduct(productId, product.price);
        res.redirect('/cart');
    });
};

exports.postCartDeleteItem = (req, res, next) => {
    const productId = req.body.productId;
    Product.findById(productId, (product) => {
        Cart.deleteProduct(productId, product.price);
        res.redirect('/cart');
    });
};

exports.getOrders = (req, res, next) => {
    res.render('shop/orders', { docTitle: 'Orders', path: '/orders' });
};

exports.getProducts = (req, res, next) => {
    Product.fetchAll()
        .then(([rows, filedData]) => {
            res.render('shop/product-list', { docTitle: 'Products', prods: rows, path: '/products' });
        })
        .catch(err => {
            console.log(err);
        })
};

exports.getProduct = (req, res, next) => {
    const productId = req.params.productId;
    Product.findById(productId)
        .then(([product]) => {
            res.render('shop/product-detail', { docTitle: 'Product Detail', product: product[0], path: '/products' });
        })
        .catch(err => {
            console.log(err);
        });
};