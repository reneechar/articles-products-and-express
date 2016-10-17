const express = require('express');
const router = express.Router();
const fs = require('file-system');
const dbArticles = require('../db/articles.js')

const page = 'Articles Page';

router.route('/')
  .get(dbArticles.analyticsTracker, (req,res) => {
    dbArticles.getArticleList()
      .then(table => {
        res.render('index', {
          page,
          articles: table
        })
      })
  })
  .post(dbArticles.analyticsTracker, (req,res) => {
    dbArticles.addNewArticle(req,res)
  })

router.route('/:title')
  .put(dbArticles.analyticsTracker, (req,res) => {
    let success = false;
    if (dbArticles.editArticle(req)) {
      success = true;
    }
    res.json({success});
  })
  .delete(dbArticles.analyticsTracker, (req,res) => {
    dbArticles.deleteArticle(req.params.title)
      .then(done => {
        res.json({success: true});
      })
      .catch(err => {
        res.json({success: false});
      })
  })

router.route('/:title/edit')
  .get(dbArticles.analyticsTracker, (req,res) => {
    dbArticles.getArticle(req.params.title)
      .then(table => {
        res.render('edit', {
          page,
          article: table[0]
        })
      })
  })
  .post(dbArticles.analyticsTracker, (req,res) => {
    let success = false;
    if(dbArticles.editArticle(req)) {
      success = true;
    }
    res.json({success});
  })

router.route('/new')
  .get(dbArticles.analyticsTracker, (req,res) => {
    res.render('new', {
      page
    })
  })
  .post(dbArticles.analyticsTracker, (req,res) => {
    dbArticles.addNewArticle(req,res);
  })

module.exports = router;