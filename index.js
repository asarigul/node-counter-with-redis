const express = require('express');
const app = express();
const port = process.env.PORT || 3000;

app.set('view engine', 'pug');
app.set('views', __dirname + '/views');

app.get('/', (req, res) => {
    res.render('home', {
        title: 'Welcome',
        visits: 1,
    } );
})

app.listen(port, () => {
    console.log(`Listening on port ${port}`);
})