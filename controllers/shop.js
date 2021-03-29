const Order = require('../models/order');
const Product = require('../models/product');
const User = require('../models/user');
// const Cart = require('../models/cart');

exports.getIndex = (req, res, next) => {
    Product.find().then(products => {
        res.render('shop/index', {
            docTitle: 'Shop',
            path: '/',
            prods: products,
        });
    }).catch(e => {
        const error = new Error(e);
        next(error);
    });
};

exports.getCart = (req, res, next) => {
    req.user
        .populate('cart.items.productId')
        .execPopulate()
        .then(user => {
            const products = user.cart.items;
            res.render('shop/cart', {
                docTitle: 'Cart',
                path: '/cart',
                products: products,
            });
        })
        .catch(e => {
            const error = new Error(e);
            next(error);
        });
};

exports.postCart = (req, res, next) => {
    const prodId = req.body.productId;

    Product.findById(prodId).then(product => {
            return req.user.addToCart(product);
        })
        .then(result => {
            res.redirect('/cart');
        })
        .catch(e => {
            const error = new Error(e);
            next(error);
        });
};

exports.postCartDeleteItem = (req, res, next) => {
    const prodId = req.body.productId;
    req.user.removeFromCart(prodId)
        .then(result => {
            res.redirect('/cart');
        }).catch(e => {
            const error = new Error(e);
            next(error);
        });
};

exports.getOrders = (req, res, next) => {
    Order.find({
            'user.userId': req.user._id
        })
        .then(orders => {
            res.render('shop/orders', {
                path: '/orders',
                docTitle: 'Your Orders',
                orders: orders,
            });
        })
        .catch(e => {
            const error = new Error(e);
            next(error);
        });
};

exports.getProducts = (req, res, next) => {
    Product.find().then(products => {
        res.render('shop/product-list', {
            docTitle: 'Products',
            prods: products,
            path: '/products',
        });
    }).catch(e => {
        const error = new Error(e);
        next(error);
    });
};

exports.getProduct = (req, res, next) => {
    const productId = req.params.productId;
    Product.findById(productId)
        .then((product) => {
            res.render('shop/product-detail', {
                docTitle: 'Product Detail',
                product,
                path: '/products',
            });
        })
        .catch(e => {
            const error = new Error(e);
            next(error);
        });
};

exports.postOrder = (req, res, next) => {
    req.user.populate('cart.items.productId')
        .execPopulate()
        .then(user => {
            const products = user.cart.items.map(i => {
                return {
                    product: {
                        ...i.productId._doc
                    },
                    qty: i.qty
                };
            });
            const order = new Order({
                products: products,
                user: {
                    email: req.user.email,
                    userId: req.user
                }
            });
            return order.save();
        })
        .then(result => {
            return req.user.clearCart();
        }).then(result => {
            res.redirect('/orders');
        })
        .catch(e => {
            const error = new Error(e);
            next(error);
        });
};