const express = require('express');
const router = express.Router();
const fs = require('file-system');
const dbProducts = require('../db/products.js');

router.get('/', (req,res) => {
  res.render('index', {
    page: 'Product Page',
    products: dbProducts.getProductList()
  })
})


// handles requests from postman
router.put('/:id', (req,res) => {
  dbProducts.editProduct(req,res);
})

router.delete('/:id', (req,res) => {
  dbProducts.deleteProduct(req,res);
})


//handles get request from browser/postman
router.get('/:id/edit', (req,res) => {
  res.render('edit', {
    page: 'Product Page',
    product: dbProducts.getProduct(req)
  })
})

//handles put request from browser
router.post('/:id/edit', (req,res) => {
  dbProducts.editProduct(req,res);

})


router.get('/new', (req,res) => {
  res.render('new', {
    page: 'Product Page'
  })
})

router.post('/new', (req,res) => {
  dbProducts.addNewProduct(req);

  res.json({success:true})

})

module.exports = router;