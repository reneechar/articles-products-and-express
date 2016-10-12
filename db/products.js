//module with helper methods to retrieve data
const express = require('express');
const fs = require('file-system');
const moment = require('moment');

let productList = [];

let idNumber = 1;

function addNewProduct(req) {
  const product = {
    id: idNumber,
    name: req.body.name,
    price: parseFloat(req.body.price),
    inventory: parseFloat(req.body.inventory)
  }
  idNumber++;
  productList.push(product);
}

function getProductList() {
  return productList
}

//private functions

function exists(req) {
  if (productList.length > 0) {
    return productList.some(product => {
      return product.id === parseFloat(req.params.id);
    })
  } else {
    return false;
  }
}

function editName(name, id) {
  productList = productList.map(product => {
    if (product.id === id) {
      product.name = name;
    }
    return product
  })
}

function editPrice(price,id) {
  productList = productList.map(product => {
    if (product.id === id) {
      product.price = price;
    }
    return product
  })
}

function editInventory(inventory,id) {
  productList = productList.map(product => {
    if (product.id === id) {
      product.inventory = inventory;
    }
    return product
  })
}


function editProduct(req,res) {
  let success = false;
  let id = parseFloat(req.params.id)

  if(exists(req)){

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
    success = true;

  }
  res.json({success});
}

function deleteProduct(req, res) {
  let success = false;
  if (exists(req)) {
    productList = productList.filter(product => {
      if (product.id !== parseFloat(req.params.id)) {
        return product
      }
    })
    success = true;
  }
  res.json({success});
}

function getProduct(req) {
  if (exists(req)) {
    return productList.find(product => {
      if(product.id === parseFloat(req.params.id)) {
        return product
      }
    })
  }
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