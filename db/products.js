//module with helper methods to retrieve data
const express = require('express');
const fs = require('file-system');
const moment = require('moment');
const db = require('./connection.js');


let productList = [];

let idNumber = 1;

function addNewProduct(req) {
  const product = {
    id: idNumber,
    name: req.body.name,
    price: parseFloat(req.body.price),
    inventory: parseFloat(req.body.inventory)
  }
  return db.query('INSERT INTO products(name,price,inventory) VALUES (${name},${price},${inventory})',product)
}

function getProductList() {
  return db.query('SELECT * FROM products ORDER BY name')
    .catch(err => {
      console.error(err);
    })
}

//private functions

function exists(id) {
  return db.query('SELECT COUNT(*) FROM products WHERE id = $1',id)
    .then(done => {
      return parseInt(done[0].count) > 0;
    })
    .catch(err => {
      console.error(err);
    })
}

function editName(name, id) {
  const n = {
    id,
    name
  }

  db.query('UPDATE products SET name = ${name} WHERE id = ${id}', n)
    .catch(err => {
      console.error(err);
    })
}

function editPrice(price,id) {
  const p = {
    id,
    price
  }

  db.query('UPDATE products SET price = ${price} WHERE id = ${id}',p)
    .catch(err => {
      console.error(err);
    })
}

function editInventory(inventory,id) {
  const i = {
    id,
    inventory
  }

  db.query('UPDATE products SET inventory = ${inventory} WHERE id = ${id}',i)
    .catch(err => {
      console.error(err);
    })
}


function editProduct(req) {
  let id = parseFloat(req.params.id)

  if(exists(id)){

    let name = req.body.name;
    let price = req.body.price;
    let inventory = req.body.inventory;

    if (name) {
      editName(name,id)
    }
    if (price) {
      editPrice(price,id)
    }
    if (inventory) {
      editInventory(inventory,id)
    }
    return true;
  } else {
    return false;
  }
}

function deleteProduct(id) {
  return db.query('DELETE FROM products WHERE id = $1',parseInt(id))
}

function getProduct(id) {

  return db.query('SELECT * FROM products WHERE id = $1',parseInt(id))
}

function getURI(req) {
  if (req.params.id) {
    let id = req.params.id;
    return `/products/${id}/edit`
  } else {
    return `/products${req.route.path}`
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

function payloadValidation(req,res,next) {
  //body
}

module.exports = {
  addNewProduct,
  getProductList,
  editProduct,
  deleteProduct,
  getProduct,
  analyticsTracker,
  payloadValidation,
}