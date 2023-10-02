const express = require('express')
const router = express.Router()
const Author = require('../models/authors')
const Book = require('../models/books')

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


router.get('/:id', async (req,res)=>{

  try{
    const author = await Author.findById(req.params.id)
    const booksByAuthor = await Book.find({ author: author.id}).limit(6).exec()
    res.render('authors/show', { author: author,booksByAuthor:booksByAuthor })
  }
  catch{

  }
})


router.post('/',async (req,res)=>{
  const author = new Author({
    name:req.body.name
  })
  try {
    const newAuthor = await author.save();
    // Author was successfully created, redirect to the list of authors
    res.redirect(`/authors/${newAuthor.id}`);
  } catch (err) {
    res.render('authors/new',{
      author,
      errorMessage:'Error creating an author'
    });
  }
})




router.get('/:id/edit',async (req,res)=>{
  try{
    const author = await Author.findById(req.params.id)
    console.log(author)
    res.render('authors/edit', { author: author })
  }
  catch{
    res.render('authors')
  }
})

router.put('/:id',async(req,res)=>{
 let author
  try {
    author = await Author.findById(req.params.id)
    author.name = req.body.name
    await author.save();
    res.redirect(`/authors/${author.id}`);
  } catch (err) {
    if(author == null){
      res.render('/');
    }else{
      res.render('authors/edit',{
        author,
        errorMessage:'Error updating an author'
      });
    }
 
  }
})
router.delete('/:id', async (req,res)=>{
  let author
  try {
    author = await Author.findById(req.params.id)
    const booksByAuthor = await Book.find({ author: author.id}).limit(6).exec()
    if(booksByAuthor.length > 0){
      if(author == null){
        res.redirect(`/`);
      }else{
        res.redirect(`/authors/${author.id}`);
      }
      return;
    }
    await Author.findOneAndRemove({ _id: req.params.id } )
    res.redirect(`/authors`);
  } catch (err) {  
    if(author == null){
      res.redirect(`/`);
    }else{
      res.redirect(`/authors/${author.id}`);
    }
   
  }
})

module.exports = router