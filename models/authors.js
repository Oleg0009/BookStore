const mongoose = require('mongoose')
const Book = require('./books')
const authorsSchema = new mongoose.Schema({
  name:{
    type:String, 
    required:true
  },
  overview:{
    type:String, 
  },
  coverImage:{
    type:Buffer,
  },
  coverImageType:{
    type:String,
  },
})


authorsSchema.pre('findOneAndRemove', { document: true }, async function(next){
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

authorsSchema.virtual('coverImagePath').get(function(){
  if(this.coverImage != null && this.coverImageType != null){
    return `data:${this.coverImageType};charset=utf-8;base64,${this.coverImage.toString('base64')}`
  }
})


module.exports = mongoose.model("Author",authorsSchema) 