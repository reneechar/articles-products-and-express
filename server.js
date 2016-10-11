const express = require('express');
const pug = require('pug');
const app = express();
// const PORT = 8080;
const bodyParser = require('body-parser');
const products = require('./routes/products.js');
const articles = require('./routes/articles.js');


//applying template engine as middleware
app.set('view engine','pug');

//Tell express where our template files live
app.set('views','./views');

app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static('./public'));
app.use('/products',products);
app.use('/articles',articles);

app.get('/', (req,res) => {
  res.render('index', {
    home: 'Welcome to the Homepage!'
  });
})


const server = app.listen(8080, () => {
  console.log(`Server listening on 8080`)
})