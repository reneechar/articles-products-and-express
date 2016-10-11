//module with helper methods to retrieve data

let articleList = [];


function addNewArticle(req) {
  const article = {
    title: req.body.title,
    author: req.body.author,
    body: req.body.body
  }
  articleList.push(article);
}

function getArticleList() {
  return articleList
}

//private functions

function exists(req) {
  if (articleList.length > 0) {
    return articleList.some(article => {
      return article.title === req.params.title;
    })
  } else {
    return false;
  }
}

function editTitle(oldTitle, title) {
  articleList = articleList.map(article => {
    if (article.title === oldTitle) {
      article.title = title;
    }
    return article
  })
}

function editPrice(price,title) {
  articleList = articleList.map(article => {
    if (article.title === title) {
      article.price = price;
    }
    return article
  })
}

function editInventory(inventory,title) {
  articleList = articleList.map(article => {
    if (article.title === title) {
      article.inventory = inventory;
    }
    return article
  })
}


function editArticle(req,res) {
  let success = false;
  let title = req.params.title

  if(exists(req)){

    let author = req.body.author;
    let body = req.body.body;

    if (name) {
      editTitle(name,title)
    }
    if (price) {
      editPrice(price,title)
    }
    if (inventory) {
      editInventory(inventory,title)
    }
    success = true;

  }
  res.json({success});
}

function deleteArticle(req, res) {
  let success = false;
  if (exists(req)) {
    articleList = articleList.filter(article => {
      if (article.title !== parseFloat(req.params.title)) {
        return article
      }
    })
    success = true;
  }
  res.json({success});
}

function getArticle(req) {
  if (exists(req)) {
    return articleList.find(article => {
      if(article.title === req.body.title) {
        return article
      }
    })
  }
}

module.exports = {
  addNewArticle,
  getArticleList,
  editArticle,
  deleteArticle,
  getArticle
}