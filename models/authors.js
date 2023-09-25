const mongoose = require('mongoose')
const Book = require('./books')
const authorsSchema = new mongoose.Schema({
  name:{
    type:String, 
    required:true
  }
})


authorsSchema.pre('findOneAndRemove', { document: true }, async function(next){
  console.log('preremove')
  Book.find({author:this.id},(err,books)=>{
    if(err){
      next(err)
    }else if(books.length > 0){
      next(new Error('This author has books still'))
    }else{
      next()
    }
  })
})
module.exports = mongoose.model("Author",authorsSchema) 