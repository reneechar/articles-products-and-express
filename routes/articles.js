const express = require('express');
const router = express.Router();
const fs = require('file-system');
const dbArticles = require('../db/articles.js')

const page = 'Articles Page';

//middleware
router.use(dbArticles.analyticsTracker);


router.route('/')
  .get((req,res) => {
    res.render('index', {
      page,
      articles: dbArticles.getArticleList()
    })
  })
  .post((req,res) => {
    dbArticles.addNewArticle(req,res)
  })

router.route('/:title')
  .put((req,res) => {
    dbArticles.editArticle(req,res);
  })
  .delete((req,res) => {
    dbArticles.deleteArticle(req,res);
  })

router.route('/:title/edit')
  .get((req,res) => {
    res.render('edit', {
      page,
      article: dbArticles.getArticle(req,res)
    })
  })
  .post((req,res) => {
    dbArticles.editArticle(req,res);
  })

router.route('/new')
  .get((req,res) => {
    res.render('new', {
      page
    })
  })
  .post((req,res) => {
    dbArticles.addNewArticle(req,res);
  })

module.exports = router;