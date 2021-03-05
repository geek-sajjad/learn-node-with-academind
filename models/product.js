const { getDb } = require('../util/database');
const mongodb = require('mongodb');

class Product {
    constructor(title, price, imageUrl, description) {
        this.title = title;
        this.price = price;
        this.imageUrl = imageUrl;
        this.description = description;
    }

    save() {
        const db = getDb();
        return db.collection('products').insertOne(this);
    }

    static fetchAll() {
        const db = getDb();
        return db
            .collection('products')
            .find()
            .toArray();
    }

    static getProduct(id) {
        const db = getDb();
        return db.collection('products').find({ _id: new mongodb.ObjectID(id) }).next();
    }

    static deleteProduct(id) {
        const db = getDb();
        return db.collection('products').deleteOne({ _id: new mongodb.ObjectID(id) });
    }

    static updateProduct(id, { title, price, description, imageUrl }) {
        const db = getDb();
        return db.collection('products').updateOne({ _id: (id) }, {
            $set: {
                "_id": (id),
                "title": title,
                "price": price,
                "description": description,
                "imageUrl": imageUrl
            },
        });
    }
}

module.exports = Product;