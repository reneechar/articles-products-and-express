const express = require('express');
const router = express.Router();
const fs = require('file-system');
const dbArticles = require('../db/articles.js')

router.get('/', (req,res) => {
  res.render('index', {
    page: 'Articles Page',
    articles: dbArticles.getArticleList()
  })
  console.log('list',dbArticles.getArticleList())
})

//handles postman requests
router.post('/', (req,res) => {
  dbArticles.addNewArticle(req,res)

})
router.put('/:title', (req,res) => {
  dbArticles.editArticle(req,res);
})
router.delete('/:title', (req,res) => {
  dbArticles.deleteArticle(req,res);
})


//handles get request from browser/postman
router.get('/:title/edit', (req,res) => {
  res.render('edit', {
    page: 'Articles Page',
    article: dbArticles.getArticle(req,res)
  })
})

//handles put request from browser
router.post('/:title/edit', (req,res) => {
  dbArticles.editArticle(req,res);
})

router.get('/new', (req,res) => {
  res.render('new', {
    page: 'Article Page'
  })
})

router.post('/new', (req,res) => {
  dbArticles.addNewArticle(req,res);
})
module.exports = router;