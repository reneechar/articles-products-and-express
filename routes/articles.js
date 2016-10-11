const express = require('express');
const router = express.Router();
const fs = require('file-system');

router.get('/', (req,res) => {
  res.render('index', {
    page: 'Articles Page'
  })
})

router.post('/', (req,res) => {

})



module.exports = router;