//module with helper methods to retrieve data

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

module.exports = {
  addNewArticle,
  getArticleList,
  editArticle,
  deleteArticle,
  getArticle
}