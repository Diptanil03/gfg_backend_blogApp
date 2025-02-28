const express = require('express')
const router = express.Router()
const Blog = require('../models/Blog')
const auth = require('../middlewares/auth')

router.post('/createblog',auth, async(req, res)=>{
    try{
    const {title, blog} = req.body
    const user = req.user
     const author = user._id
    const newBlog = new Blog({title, blog, author})
    await newBlog.save()
    res.status(201).json({message: 'Blog created successfully'})
    }catch(err){
        res.status(500).json({message: 'Error creating blog', error: err})
        }
})
router.get('/allblogs', async(req, res)=>{
    try{
        const blogs = await Blog.find()
        res.status(200).json(blogs)
    }
    catch(err){
        res.status(500).json({message: 'Error fetching blogs', error: err})
    }
})
//get the blogs of an author
router.get('/getallblog',auth, async(req, res)=>{
    try{
        const user = req.user
        const blogs = await Blog.find({author: user._id})
        res.status(200).json({
            message:"all blogs of the author",
            blogs})
    }
    catch(err){
        res.status(500).json({message: 'Error fetching blogs', error: err})
    }
})

router.patch('/updatesblog/:id', auth, async(req, res)=>{
    try{
        const id = req.params.id
        const {title, blog} = req.body
        const user = req.user
        // const updatedBlog = await Blog.findByIdAndUpdate(id, {title, blog}, {new: true})
        const findBlog = await Blog.findOne({_id:id, author:user._id})
        if(!findBlog){
            return res.status(404).json({message: 'Blog not found'})
            }
            const updatedBlog = await Blog.findByIdAndUpdate(id, {title, blog}, {new: true})
        await updatedBlog.save()
        res.status(200).json({message: 'Blog updated successfully',
            updatedBlog
        })
    }
    catch(err){
        res.status(500).json({message: 'Error updating blog', error: err})
    }
})

router.delete('/deleteblog/:id',auth,async(req, res)=>{
    try{
        const id = req.params.id
        const user = req.user
        const findBlog = await Blog.findOne({_id:id, author:user._id})
        if(!findBlog){
            return res.status(404).json({message: 'Blog not found'})
            }
            await Blog.deleteOne({_id:id})
            res.status(200).json({message: 'Blog deleted successfully'})
    }
    catch(err){
        res.status(500).json({message: 'Error deleting blog', error: err})
        console.log(err)
    }
})


module.exports=router