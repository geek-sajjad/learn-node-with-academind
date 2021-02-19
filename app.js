const express = require('express');

const app = express();

app.use((req, res, next) => {
    console.log('in the first middleware');
    next();
});

app.use((req, res, next) => {
    console.log('in the scound middleware');
    next();
})


app.use('/users', (req, res, next) => {
    res.send('list of users');
});

app.use('/', (req, res, next) => {
    res.send('Welcome to website');
});


app.listen(3000);