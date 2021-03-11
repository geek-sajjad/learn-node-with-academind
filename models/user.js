const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const userScheam = new Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
    },
    cart: {
        items: [{
            productId: { type: mongoose.Types.ObjectId, required: true, ref: 'Product' },
            qty: { type: Number, required: true }
        }]
    }
});

userScheam.methods.addToCart = function(product) {
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
            productId: product._id,
            qty: 1
        });
    }
    this.cart = updatedCart;
    return this.save();

}

userScheam.methods.removeFromCart = function(productId) {
    const updatedCartItems = this.cart.items.filter(i => {
        return i.productId.toString() !== productId.toString();
    });
    this.cart.items = updatedCartItems;
    return this.save();
}

userScheam.methods.clearCart = function() {
    this.cart = { items: [] };
    return this.save();
}

module.exports = mongoose.model('User', userScheam);