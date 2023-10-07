const express = require('express')
const { isAuthenticated } = require('../services/passport')

const router = express.Router()
const Author = require('../models/authors')
const Book = require('../models/books')
const imageMimeTypes = ['image/jpeg','image/png','image/gif']

router.get('/' , async (req,res)=>{
  let searchOptions = {}
  if(req.query.name != null && req.query.name !== '' ){
    searchOptions.name = new RegExp(req.query.name,'i')
  }
  try {
    const authors = await  Author.find(searchOptions)
    res.format({
      html: () => {
        // If the client requests HTML, render the HTML content
        res.render('authors/index', {
          authors: authors,
          searchOptions: req.query
        });
      },
      json: () => {
        // If the client requests JSON, send additional data as JSON
        res.json({
          authors: authors
        });
      }
    });
  } catch (error) {
    res.render('/')
  }
})


router.get('/new',isAuthenticated, (req,res)=>{
  res.render('authors/new', { author: new Author() })
})



router.get('/:id', async (req,res)=>{
  try{
    const author = await Author.findById(req.params.id)
    const booksByAuthor = await Book.find({ author: author.id}).limit(6).exec()
    console.log(author.overview);
    res.render('authors/show', { author: author,booksByAuthor:booksByAuthor })
  }
  catch{

  }
})


router.post('/',async (req,res)=>{
  let author = new Author({
    name:req.body.name,
    overview:req.body.overview,
  });
  saveCover(author,req.body.cover)
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
    author.overview = req.body.overview;

    (req.body.cover != null  || req.body.cover !== '') && saveCover(author,req.body.cover);

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


function saveCover(author,coverEncoded){
  if(coverEncoded == null) return;
  const cover = JSON.parse(coverEncoded)

  if(cover !== null && imageMimeTypes.includes(cover.type)){
    author.coverImage = new Buffer.from(cover.data,'base64')
    author.coverImageType = cover.type
  }
}

module.exports = router