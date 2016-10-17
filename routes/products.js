const express = require('express');
const router = express.Router();
const fs = require('file-system');
const dbProducts = require('../db/products.js');

const page = 'Product Page';


router.get('/', dbProducts.analyticsTracker, (req,res) => {
  dbProducts.getProductList()
    .then(table => {
      res.render('index', {
        page,
        products: table
      })
    })
})

// handles requests from postman
router.route('/:id')
  .put(dbProducts.analyticsTracker, (req,res) => {
    let success = false;
    if (dbProducts.editProduct(req)){
      success = true;
    }
    res.json({success});
  })
  .delete(dbProducts.analyticsTracker, (req,res) => {
    dbProducts.deleteProduct(req.params.id)
      .then(done => {
        res.json({success: true});
      })
      .catch(err => {
        res.json({success: false});
      })
  })

//handles get request from browser/postman
router.route('/:id/edit')
  .get(dbProducts.analyticsTracker, (req,res) => {
    dbProducts.getProduct(req.params.id)
      .then(table => {
        res.render('edit', {
          page,
          product: table[0]
        })
      })
  })
  .post(dbProducts.analyticsTracker, (req,res) => {
    let success = false;
    if (dbProducts.editProduct(req)) {
      success = true;
    }
    res.json({success});
  })

router.route('/new')
  .get(dbProducts.analyticsTracker, (req,res) => {
    res.render('new', {
      page
    })
  })
  .post(dbProducts.analyticsTracker, (req,res) => {
    dbProducts.addNewProduct(req)
      .then(done => {
        res.json({success:true})
      })
      .catch(err => {
        res.json({success: false});
        console.error(err);
      })
  })

module.exports = router;