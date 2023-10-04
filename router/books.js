const express = require('express')
const router = express.Router()
const Author = require('../models/authors')
const Book = require('../models/books')
const imageMimeTypes = ['image/jpeg','image/png','image/gif']


router.get('/', async (req,res)=>{
  let searchOptions = {}
  if(req.query.title != null && req.query.title !== '' ){
    searchOptions.title = new RegExp(req.query.title, 'i')
  }
  if (req.query.publishedBefore != null && req.query.publishedBefore !== '') {
    searchOptions.publishedDate = { $lte: new Date(req.query.publishedBefore) };
  }

  if (req.query.publishedAfter != null && req.query.publishedAfter !== '') {
    searchOptions.publishedDate = {
      ...searchOptions.publishedDate,
      $gte: new Date(req.query.publishedAfter)
    };
  }

  try{
    const books = await Book.find(searchOptions).exec();
    res.render('books/index',{
      books:books,
      searchOptions:req.query
    })
  }catch{
    res.redirect('authors')
  }
})


router.get('/new', async (req,res)=>{
  renderFormPage(res,new Book(),false,'new','Error creating book')
})

router.get('/:id', async (req,res)=>{
  try{
    const book = await Book.findById(req.params.id).populate('author').exec()
    res.render('books/show', { book: book })
  }
  catch{}
})


router.post('/', async (req,res)=>{
  const book = new Book({
    title:req.body.title,
    description:req.body.description,
    publishedDate: new Date(req.body.publishedDate),
    pageCount:req.body.pageCount,
    author:req.body.author
  });
  saveCover(book,req.body.cover)
  try{
    const newBook = await book.save()
    res.redirect('books')
  }
  catch {
    renderFormPage(res,book,true,'new','Error creating book')
  }
})



router.get('/:id/edit',async (req,res)=>{
  try{
    const book = await Book.findById(req.params.id)
    renderFormPage(res,book,true,'edit','Error editing book')
  }
  catch{
    res.render('books')
  }
})


router.put('/:id',async(req,res)=>{
   let book
  try {
    book = await Book.findById(req.params.id)
    book.title = req.body.title;
    book.description=req.body.description;
    book.publishedDate=new Date(req.body.publishedDate);
    book.pageCount = req.body.pageCount;
    book.author = req.body.author;
    
    (req.body.cover != null  || req.body.cover !== '') && saveCover(book,req.body.cover)
    await book.save();
    res.redirect(`/books/${book.id}`);
  } catch(err) {
    if(book != null){
      renderFormPage(res,book,true,'edit',err.errorMessage)
    }else{
      redirect('/')
    } 
  }
})

router.delete('/:id', async (req,res)=>{
  let book
  try {
    book = await Book.findById(req.params.id)
    await Book.findOneAndRemove({ _id: req.params.id } )
    res.redirect(`/books`);
  } catch (err) {  
    if(book == null){
      res.redirect(`/`);
    }else{
      res.redirect(`/books/${book.id}`);
    }
  }
})

function saveCover(book,coverEncoded){
  if(coverEncoded == null) return;
  const cover = JSON.parse(coverEncoded)
  if(cover !== null && imageMimeTypes.includes(cover.type)){
    book.coverImage = new Buffer.from(cover.data,'base64')
    book.coverImageType = cover.type
  }
}

async function renderFormPage(res,book,hasError = false, form , errorMessage){
  try {
    const authors = await Author.find({});

    const params = {
      authors:authors,
      book:book
    }

    if(hasError) params.errorMessage = errorMessage;
    res.render(`books/${form}`,params);

  } catch (error) {
    res.render('books')
  }
}


module.exports = router