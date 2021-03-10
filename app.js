const path = require('path');
const express = require('express');
require('dotenv').config()

const adminRoutes = require('./routes/admin');
const shopRoutes = require('./routes/shop');
const error = require('./controllers/error');
const { mongoConnect } = require('./util/database');
const User = require('./models/user');
const app = express();

app.set('view engine', 'ejs');

app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));

app.use((req, res, next) => {
    User.findById('6044ff15efdf74122c9777b8')
        .then(user => {
            req.user = user;
            next();
        })
        .catch(e => console.log(e));
});

app.use('/admin', adminRoutes);
app.use(shopRoutes);
app.use(error.get404);

mongoConnect(() => {
    console.log('connected');
    app.listen(3000);
});