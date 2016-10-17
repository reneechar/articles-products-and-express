//module with helper methods to retrieve data
const express = require('express');
const fs = require('file-system');
const moment = require('moment');
const db = require('./connection.js');


let articleList = [];

function generateURLEncoded(str) {
  return str.split(' ').join('-');
}

function unEncodeURL(str) {
  return str.split('-').join(' ');
}


function addNewArticle(req,res) {
  let success = false;
  const article = {
    title: req.body.title,
    author: req.body.author,
    body: req.body.body,
    url_title: generateURLEncoded(req.body.title)
  }
  return db.query('INSERT INTO articles (title,author,body,url_title) VALUES (${title},${author},${body},${url_title})', article)
    .then(s => {
      success = true;
      res.json({success})
    })
    .catch(error => {
      console.error(error);
      res.json({success});
    })
}

function getArticleList() {
  return db.query('SELECT * FROM articles ORDER BY title')
    .catch(err => {
      console.error(err);
    })
}

//private functions

function exists(title) {
  //search through database and return true or false
  return db.query('SELECT COUNT(*) FROM articles WHERE title = $1',title)
    .then(done => {
      return parseInt(done[0].count) > 0;
    })
    .catch(err => {
      console.error(err);
    });
}

function editTitle(title,oldTitle) {

  const t = {
    title,
    oldTitle,
    url_title: generateURLEncoded(title)
  }

  db.query('UPDATE articles SET title = ${title} WHERE title = ${oldTitle}',t)
    .then(done => {
      db.query('UPDATE articles SET url_title = ${url_title} WHERE title = ${title}',t)
        .catch(err => {
          console.error(err);
        })
    })
    .catch(err => {
      console.error(err);
    })
}

function editAuthor(author,title) {
  const a = {
    author,
    title
  }

  db.query('UPDATE articles SET author = ${author} WHERE title = ${title}',a)
    .catch(err => {
      console.error(err);
    })
}

function editBody(body,title) {
  const b = {
    body,
    title
  }

  db.query('UPDATE articles SET body = ${body} WHERE title = ${title}',b)
    .catch(err => {
      console.error(err);
    })
}


function editArticle(req) {
  let URLOldTitle = req.params.title;
  let oldTitle = unEncodeURL(URLOldTitle);
  if(exists(oldTitle)){

    let author = req.body.author;
    let body = req.body.body;
    let newTitle;
    if (req.body.title) {
      newTitle = req.body.title;
    } else {
      newTitle = oldTitle;
    }

    if (newTitle) {
      editTitle(newTitle,oldTitle)
    }
    if (author) {
      editAuthor(author,newTitle)
    }
    if (body) {
      editBody(body,newTitle)
    }
    return true;
  } else {
    return false;
  }
}

function deleteArticle(url_title) {
  return db.query('DELETE FROM articles WHERE url_title = $1',url_title)
}

function getArticle(title) {
  return db.query('SELECT * FROM articles WHERE title = $1',unEncodeURL(title))
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
  } else {
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
}


module.exports = {
  addNewArticle,
  getArticleList,
  editArticle,
  deleteArticle,
  getArticle,
  analyticsTracker
}