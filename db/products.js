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
  if (productList > 0) {
    return productList.some(product => {
      return product.id === req.params.id;
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
  if(exists(req)){
    let name = req.body.name;
    let price = req.body.price;
    let inventory = req.body.inventory;

    if (name) {
      editName(name,req.params.id)
    }
    if (price) {
      editPrice(price,req.params.id)
    }
    if (inventory) {
      editInventory(inventory,req.params.id)
    }
    res.json({success:true})

  } else {
    res.json({success:false})
  }
}

module.exports = {
  addNewProduct,
  getProductList,
  editProduct
}