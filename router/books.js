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
  renderNewPage(res,new Book())
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
    renderNewPage(res,book,true)
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



async function renderNewPage(res,book,hasError = false){
  try {
    const authors = await Author.find({});

    const params = {
      authors:authors,
      book:book
    }

    if(hasError) params.errorMessage = 'Error creating book';
    res.render('books/new',params);

  } catch (error) {
    res.render('books')
  }
}

module.exports = router