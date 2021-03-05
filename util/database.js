const mongodb = require('mongodb');
const MongoClient = mongodb.MongoClient;

let _db;
const mongoConnect = (callback) => {
    MongoClient.connect(process.env.MONGO_DB_URI, { useNewUrlParser: true, useUnifiedTopology: true })
        .then(client => {
            _db = client.db('academind');
            callback();
        })
        .catch(e => {
            console.log(e)
            throw e;
        });
}

const getDb = () => {
    if (_db) {
        return _db;
    }
    throw "no database connection found!";
};

exports.mongoConnect = mongoConnect;
exports.getDb = getDb;