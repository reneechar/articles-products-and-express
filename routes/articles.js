const express = require('express');
const router = express.Router();
const fs = require('file-system');
const dbArticles = require('../db/articles.js')

router.get('/', (req,res) => {
  res.render('index', {
    page: 'Articles Page',
    articles: dbArticles.getArticleList()
  })
})


// handles requests from postman
router.put('/:id', (req,res) => {
  console.log('test');
  dbArticles.editArticle(req,res);
})

router.delete('/:id', (req,res) => {
  dbArticles.deleteArticle(req,res);
})


//handles get request from browser/postman
router.get('/:id/edit', (req,res) => {
  res.render('edit', {
    page: 'Product Page',
    product: dbArticles.getArticle(req)
  })
})

//handles put request from browser
router.post('/:id/edit', (req,res) => {
  dbArticles.editArticle(req,res);

})


router.get('/new', (req,res) => {
  res.render('new', {
    page: 'Article Page'
  })
})

router.post('/new', (req,res) => {
  dbArticles.addNewArticle(req);

  res.json({success:true})

})
module.exports = router;