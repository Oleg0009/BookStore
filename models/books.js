const mongoose = require('mongoose')
const booksSchema = new mongoose.Schema({
  title:{
    type:String, 
    required:true
  },
  description:{
    type:String, 
  },
  publishedDate:{
    type:Date,
    required:true,
  },
  createdAt:{
    type:Date,
    required:true,
    default:Date.now
  },
  pageCount:{
    type:Number
  },
  coverImage:{
    type:Buffer,
    required:true
  },
  coverImageType:{
    type:String,
    required:true
  },
  author:{
    type: mongoose.Schema.Types.ObjectId,
    required:true,
    ref:'Author'
  }

})
booksSchema.virtual('coverImagePath').get(function(){
  if(this.coverImage != null && this.coverImageType != null){
    return `data:${this.coverImageType};charset=utf-8;base64,${this.coverImage.toString('base64')}`
  }
})


module.exports = mongoose.model("Book",booksSchema) 