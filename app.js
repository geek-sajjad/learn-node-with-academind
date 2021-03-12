const path = require('path');
const express = require('express');
const session = require('express-session');
const MongoDBStore = require('connect-mongodb-session')(session);
const mongoose = require('mongoose');
require('dotenv').config()

const adminRoutes = require('./routes/admin');
const shopRoutes = require('./routes/shop');
const atuhRoutes = require('./routes/auth');
const error = require('./controllers/error');
const User = require('./models/user');

const app = express();
const store = MongoDBStore({
    uri: process.env.MONGO_DB_URI,
    collection: 'sessions'
});

app.set('view engine', 'ejs');

app.use((req, res, next) => {
    User.findById('604a3a095ea61b102d78b3fc').then(user => {
        req.user = user;
        next();
    }).catch(e => console.log(e));
});
app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));
app.use(session({
    secret: 'IKyhqgxKmT',
    resave: false,
    saveUninitialized: false,
    store: store,
}));

app.use('/admin', adminRoutes);
app.use(shopRoutes);
app.use(atuhRoutes);
app.use(error.get404);
mongoose.connect(process.env.MONGO_DB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false,
    useCreateIndex: true
}).then(result => {
    User.findOne().then(user => {
        if (!user) {
            const user = new User({
                name: 'sajad',
                email: 'sajad@me.com',
                cart: []
            });
            user.save();
        }
    });
    app.listen(3000);
}).catch(e => console.log(e));