const mongodb = require('mongodb');
const MongoClient = mongodb.MongoClient;

const mongoConnect = (callback) => {
    MongoClient.connect(process.env.MONGO_DB_URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true
        })
        .then(client => {
            console.log('Connected to mongodb atlas successfully');
            callback(client);
        }).catch(err => {
            console.log(err);
        });
}

module.exports = mongoConnect;