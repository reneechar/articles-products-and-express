
const Promise = require('bluebird');
var pgp = require('pg-promise')({
  promiseLib: Promise
})

var db = pgp(
  'postgres://temp_user:temp@localhost:5432/articles_products_and_express'
)
//can only make one connection with the database
//export db so that it can be used in other files
//to make more queries on the database

db.query('SELECT * FROM articles')
  .then(articles => {
    console.log(articles)
  })
  .catch(error => {
    console.error(error);
  })

let newArticle = {
  title: 'MY FIRST ARTICLE',
  body: 'BLAH BLEH BLUE',
  author: 'Renee',
  url_title: 'MY%FIRST%ARTICLE'
}


// inserting
//returns an empty array if there are no errors with inserting
db.query('INSERT INTO articles(title,body,author,url_title) VALUES(${title},${body},${author},${url_title})',newArticle)
  .then(console.log)
  .catch(error => {
    console.error(error);
  });
