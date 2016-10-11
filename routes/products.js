const express = require('express');
const router = express.Router();
const fs = require('file-system');
const dbProducts = require('../db/products.js');

router.get('/', (req,res) => {
  res.render('index', {
    page: 'Product Page'
  })
})

router.post('/', (req,res) => {
  //creates a new product
  //req = { name: String, price: String, inventory: String }

  dbProducts.addNewProduct(req);

  res.render('index', {
    page: 'Product Page',
    entered: true
  })

})


//render PUT/DELETE methods
router.get('/:id', (req,res) => {
  res.render('putOrDelete', {
    page: 'Product Page'
  })
})

router.put('/:id', (req,res) => {
  //edits a product, find by id
  dbProducts.editProduct(req,res);

})



module.exports = router;