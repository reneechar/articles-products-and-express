const express = require('express');
const router = express.Router();
const fs = require('file-system');
const dbArticles = require('../db/articles.js')

const page = 'Articles Page';

//middleware
// router.use(dbArticles.analyticsTracker);


router.route('/')
  .get((req,res) => {
    dbArticles.getArticleList()
      .then(table => {
        res.render('index', {
          page,
          articles: table
        })
      })
  })
  .post((req,res) => {
    dbArticles.addNewArticle(req,res)
  })

router.route('/:title')
  .put((req,res) => {
    let success = false;
    if (dbArticles.editArticle(req)) {
      success = true;
    }
    res.json({success});
  })
  .delete((req,res) => {
    dbArticles.deleteArticle(req.params.title)
      .then(done => {
        res.json({success: true});
      })
      .catch(err => {
        res.json({success: false});
      })
  })

router.route('/:title/edit')
  .get((req,res) => {
    dbArticles.getArticle(req.params.title)
      .then(table => {
        res.render('edit', {
          page,
          article: table[0]
        })
      })
  })
  .post((req,res) => {
    let success = false;
    if(dbArticles.editArticle(req)) {
      success = true;
    }
    res.json({success});
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