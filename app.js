const path = require('path');
const express = require('express');
const bodyParser = require('body-parser');
require('dotenv').config()

const adminRoutes = require('./routes/admin');
const shopRoutes = require('./routes/shop');
const error = require('./controllers/error');
const mongoConnect = require('./util/database');
const app = express();

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));
app.use('/admin', adminRoutes);
app.use(shopRoutes);
app.use(error.get404);

mongoConnect(client => {
    console.log(client);
    app.listen(3000);
});