//module with helper methods to retrieve data
const express = require('express');
const fs = require('file-system');
const moment = require('moment');



let articleList = [];

function generateURLEncoded(str) {
  return str.split(' ').join('-');
}

function unEncodeURL(str) {
  return str.split('-').join(' ');
}


function addNewArticle(req,res) {
  let success = false;
  if (!exists(req)) {
    const article = {
      title: req.body.title,
      author: req.body.author,
      body: req.body.body,
      urlTitle: generateURLEncoded(req.body.title)
    }
    articleList.push(article);
    success = true;
  }
  res.json({success});
}

function getArticleList() {
  return articleList
}

//private functions

function exists(title) {
  if (articleList.length > 0) {
    return articleList.some(article => {
      return article.title === title;
    })
  } else {
    return false;
  }
}

function editTitle(title,oldTitle) {
  articleList = articleList.map(article => {
    if (article.title === oldTitle) {
      article.title = title;
      article.urlTitle = generateURLEncoded(title);
    }
    return article
  })
}

function editAuthor(author,title) {
  articleList = articleList.map(article => {
    if (article.title === title) {
      article.author = author;
    }
    return article
  })
}

function editBody(body,title) {
  articleList = articleList.map(article => {
    if (article.title === title) {
      article.body = body;
    }
    return article
  })
}


function editArticle(req,res) {
  let success = false;
  let URLOldTitle = req.params.title
  let oldTitle = unEncodeURL(URLOldTitle)
  if(exists(oldTitle)){

    let author = req.body.author;
    let body = req.body.body;
    let newTitle = req.body.title;

    if (newTitle) {
      editTitle(newTitle,oldTitle)
    }
    if (author) {
      editAuthor(author,newTitle)
    }
    if (body) {
      editBody(body,newTitle)
    }
    success = true;

  }
  res.json({success});
}

function deleteArticle(req, res) {
  let success = false;
  if (exists(req.params.title)) {
    articleList = articleList.filter(article => {
      if (article.title !== req.params.title) {
        return article
      }
    })
    success = true;
  }
  res.json({success});
}

function getArticle(req,res) {
  let success = false;
  let title = unEncodeURL(req.params.title);
  if (exists(title)) {
    return articleList.find(article => {
      if(article.title === title) {
        return article
      }
    })
  } else {
    res.json({success})
  }
}

function getURI(req) {
  if (req.params.title) {
    let title = req.params.title;
    return `/articles/${title}/edit`
  } else {
    return `/articles${req.route.path}`
  }
}


function analyticsTracker(req,res,next) {
  if(req.route === undefined) {
    next();
  }
  let method = req.method.toLowerCase();
  let uri = getURI(req);
  let timestamp = moment().format('YYYY.MM.DD.h.mm.ss.a');
  let nowDate = timestamp.split('.').slice(0,3).join('.');

  let newData = `[${method}] [${uri}] [${timestamp}]
`

  //look through logs directory to see if date file exists
  let found = false;
  fs.readdir('./logs', (err,logFiles) => {
    if (err) {
      console.error(err);
    } else {
      logFiles.forEach(log => {
        let fileDate = log.split('.').slice(0,3).join('.')

        if (nowDate === fileDate) {
          found = true;
          fs.readFile(`./logs/${log}`, (err,data) => {
            if (err) {
              console.error(err);
            } else {
              let editFile = fs.createWriteStream(`./logs/${log}`)
              editFile.write(data.toString())
              editFile.end(newData);
            }
          })
        }
      })
      if (!found) {
        fs.writeFile(`./logs/${nowDate}.log`,newData);
      }
      next();
    }
  })
}


module.exports = {
  addNewArticle,
  getArticleList,
  editArticle,
  deleteArticle,
  getArticle,
  analyticsTracker
}