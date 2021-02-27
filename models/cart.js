const fs = require('fs');
const path = require('path');

const p = path.join(path.dirname(require.main.filename), 'data', 'cart.json');

// {products: [{id: 1, qty: 2}], totalPrice: 20}

module.exports = class Cart {
    static addProduct(id, productPrice) {
        // Fetch the previous cart
        fs.readFile(p, (err, fileContent) => {
            let cart = { products: [], totalPrice: 0 };
            if (!err) {
                cart = JSON.parse(fileContent.toString());
            }
            // Analyze the cart => Find existing product
            let existingProductIndex = cart.products.findIndex(p => p.id === id);
            // Add new product/ increase quantity
            if (existingProductIndex !== -1) {
                cart.products[existingProductIndex].qty++;
                cart.products
            } else {
                cart.products = [...cart.products, { id: id, qty: 1 }];
            }
            cart.totalPrice = +productPrice + cart.totalPrice;
            fs.writeFile(p, JSON.stringify(cart), (err) => {
                if (err) {
                    console.log(err);
                }
            });
        });
    }

    static deleteProduct(id, productPrice) {
        // Fetch the previous cart
        fs.readFile(p, (err, fileContent) => {
            if (!err) {
                const cart = JSON.parse(fileContent.toString());
                const updatedCart = {...cart };
                const removedProductQty = updatedCart.products.find(p => p.id === id).qty;
                updatedCart.totalPrice = cart.totalPrice - removedProductQty * +productPrice;
                updatedCart.products = cart.products.filter(p => p.id !== id);
                fs.writeFile(p, JSON.stringify(updatedCart), (err) => {
                    if (err) {
                        console.log(err);
                    }
                });

            }
        });
    }
}