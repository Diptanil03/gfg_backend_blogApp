const mongoose = require('mongoose')

const blogSchema = new mongoose.Schema({
    title:{
        type:String,
        required:true
    },
    blog:{
        type:String,
        required:true
    },
    author:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required:true
    }
},{timestamps: true})

const Blog = mongoose.model('Blog',blogSchema)
module.exports = Blog