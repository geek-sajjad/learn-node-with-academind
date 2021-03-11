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
}

module.exports = User;