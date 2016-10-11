//module with helper methods to retrieve data

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

module.exports = {
  addNewProduct,
  getProductList,
  editProduct,
  deleteProduct,
  getProduct
}