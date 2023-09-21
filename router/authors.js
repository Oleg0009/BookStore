const express = require('express')
const router = express.Router()
const Author = require('../models/authors')

router.get('/', async (req,res)=>{
  let searchOptions = {}
  if(req.query.name != null && req.query.name !== '' ){
    searchOptions.name = new RegExp(req.query.name,'i')
  }
  try {
    const authors = await  Author.find(searchOptions)
    res.render('authors/index',{
      authors:authors,
      searchOptions:req.query
    })
  } catch (error) {
    res.render('/')
  }

})


router.get('/new', (req,res)=>{
  res.render('authors/new', { author: new Author() })
})


router.post('/',async (req,res)=>{
  const author = new Author({
    name:req.body.name
  })
  try {
    const newAuthor = await author.save();
    // Author was successfully created, redirect to the list of authors
    res.redirect('authors');
  } catch (err) {
    res.render('authors/new',{
      author,
      errorMessage:'Error creating an author'
    });
  }
})

module.exports = router