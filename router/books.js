const express = require('express')
const router = express.Router()
const multer = require('multer')
const path = require('path')
const fs = require('fs')
const Author = require('../models/authors')
const Book = require('../models/books')
const uploadPath = path.join('public', Book.coverImageBasePath)
const imageMimeTypes = ['image/jpeg','image/png','image/gif']
const upload = multer({
  dest:uploadPath,
  fileFilter:(req,file,callback)=>{
    callback(null,imageMimeTypes.includes(file.mimetype))
  }
})


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
    console.log(books)
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


router.post('/', upload.single('cover'), async (req,res)=>{
  const fileName = req.file != null ? req.file.filename : null;
  const book = new Book({
    title:req.body.title,
    description:req.body.description,
    publishedDate: new Date(req.body.publishedDate),
    pageCount:req.body.pageCount,
    coverImageName:fileName,
    author:req.body.author
  });
  try{
    const newBook = await book.save()
    res.redirect('books')
  }
  catch {

    if(book.coverImageName)  removeBookCover(fileName)
    renderNewPage(res,book,true)
  }
  
})


function removeBookCover(fileName){
  fs.unlink(path.join(uploadPath,fileName),err=>err && console.error(err))
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