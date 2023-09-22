const mongoose = require('mongoose')
const path = require('path')
const coverImageBasePath = 'uploads/bookCovers'
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
  coverImageName:{
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
  if(this.coverImageName!= null){
    return path.join('/',coverImageBasePath,this.coverImageName)
  }
})


module.exports = mongoose.model("Book",booksSchema) 
module.exports.coverImageBasePath = coverImageBasePath