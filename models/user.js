const { getDb } = require('../util/database');
const mongodb = require('mongodb');

class User {
    constructor(username, email, cart, id) {
        this.name = username;
        this.email = email;
        this.cart = cart;
        this._id = id;
    }

    save() {
        const db = getDb();
        return db.collection('users').insertOne(this);
    }

    static findById(userId) {
        const db = getDb();
        return db.collection('users').findOne({ _id: new mongodb.ObjectID(userId) });
    }

    addToCart(product) {
        const db = getDb();
        const cartProductIndex = this.cart.items.findIndex(cp => {
            return cp.productId.toString() === product._id.toString();
        });
        let updatedCart = {
            ...this.cart
        };

        if (cartProductIndex >= 0) {
            updatedCart.items[cartProductIndex].qty++;
        } else {
            updatedCart.items.push({
                productId: new mongodb.ObjectID(product._id),
                qty: 1
            });
        }

        return db.collection('users').updateOne({ _id: new mongodb.ObjectID(this._id) }, {
            $set: { cart: updatedCart }
        });
    }

    getCart() {
        const cartProductIds = this.cart.items.map(p => {
            return p.productId;
        })
        const db = getDb();
        return db.collection('products').find({ _id: { $in: cartProductIds } }).toArray().then(products => {
            return products.map(p => {
                return {...p, qty: this.cart.items.find(i => i.productId.toString() === p._id.toString()).qty };
            })
        });
    }

    deleteItemFromCart(productId) {
        const db = getDb();
        const updatedCartItems = this.cart.items.filter(i => {
            return i.productId.toString() !== productId.toString();
        });
        return db.collection('users').updateOne({ _id: new mongodb.ObjectID(this._id) }, {
            $set: { cart: { items: updatedCartItems } }
        });
    }

    addOrder() {
        const db = getDb();
        return this.getCart()
            .then(products => {
                const order = {
                    items: products,
                    user: {
                        _id: new mongodb.ObjectId(this._id),
                        name: this.name
                    }
                };
                return db.collection('orders').insertOne(order);
            })
            .then(result => {
                this.cart = { items: [] };
                return db
                    .collection('users')
                    .updateOne({ _id: new mongodb.ObjectId(this._id) }, { $set: { cart: { items: [] } } });
            });
    }

    getOrders() {
        const db = getDb();
        return db
            .collection('orders')
            .find({ 'user._id': new mongodb.ObjectId(this._id) })
            .toArray();
    }
}

module.exports = User;