const path = require('path');
const express = require('express');
const session = require('express-session');
const MongoDBStore = require('connect-mongodb-session')(session);
const mongoose = require('mongoose');
const csrf = require('csurf');
const flash = require('connect-flash');
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
const scrfProtection = csrf();

app.set('view engine', 'ejs');

app.use(express.urlencoded({
    extended: false
}));
app.use(express.static(path.join(__dirname, 'public')));
app.use(session({
    secret: 'IKyhqgxKmT',
    resave: false,
    saveUninitialized: false,
    store: store,
}));
app.use(scrfProtection);
app.use(flash());

app.use((req, res, next) => {
    res.locals.csrfToken = req.csrfToken();
    res.locals.isAuthenticated = req.session.isLoggedIn;
    next();
});

app.use((req, res, next) => {
    if (!req.session.user) {
        return next();
    }
    User.findById(req.session.user._id)
        .then(user => {
            if (!user) {
                req.session.destroy();
                return next();
            }
            req.user = user;
            next();
        }).catch(e => {
            const error = new Error(e);
            next(error);
        });
});


app.use('/admin', adminRoutes);
app.use(shopRoutes);
app.use(atuhRoutes);
app.use(error.get404);
app.use(error.get500);
mongoose.connect(process.env.MONGO_DB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false,
    useCreateIndex: true
}).then(result => {
    app.listen(3000);
}).catch(e => {
    const error = new Error(e);
    next(error);
});