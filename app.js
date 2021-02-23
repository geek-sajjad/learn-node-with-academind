const path = require('path');

const express = require('express');
const bodyParser = require('body-parser');

const admonData = require('./routes/admin');
const shopRoutes = require('./routes/shop');

const app = express();


app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));

app.use('/admin', admonData.router);
app.use(shopRoutes);
app.use((req, res, next) => {
    // res.status(400).sendFile(path.join(__dirname, 'views', '404.html'));
    res.status(400).render('404', { docTitle: '404' });
});

app.listen(3000);