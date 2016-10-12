const express = require('express');
const router = express.Router();
const fs = require('file-system');
const dbProducts = require('../db/products.js');

const page = 'Product Page';

router.get('/', (req,res) => {
  res.render('index', {
    page,
    products: dbProducts.getProductList()
  })
})

// handles requests from postman
router.route('/:id')
  .put((req,res) => {
    dbProducts.editProduct(req,res);
  })
  .delete((req,res) => {
    dbProducts.deleteProduct(req,res);
  })

//handles get request from browser/postman
router.route('/:id/edit')
  .get((req,res) => {
    res.render('edit', {
      page,
      product: dbProducts.getProduct(req)
    })
  })
  .post((req,res) => {
    dbProducts.editProduct(req,res);
  })

router.route('/new')
  .get((req,res) => {
    res.render('new', {
      page
    })
  })
  .post((req,res) => {
    dbProducts.addNewProduct(req);
    res.json({success:true})
  })

module.exports = router;