const Promise = require('bluebird');
var pgp = require('pg-promise')({
  promiseLib: Promise
})

var db = pgp(
  'postgres://temp_user:temp@localhost:5432/articles_products_and_express'
)

module.exports = db;