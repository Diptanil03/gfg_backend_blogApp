const express = require('express')
const router = express.Router()
const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt')
const User = require('../models/User')
const nodemailer = require('nodemailer')
require('dotenv').config()
const JWT_SECRET_KEY = process.env.JWT_SECRET_KEY

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth:{
        user: process.env.COMPANY_NAME,
        pass: process.env.COMPANY_PASSWORD
    }
})


router.post('/register',async(req, res)=>{
    try{
        const {name, email, password} = req.body
        const user = new User({
            name, email, password
        })
        await user.save()
        res.status(201).send({message: 'User created successfully'})
    }
    catch(err){
        res.status(500).json({message:err.message})
    }
})

router.post('/login',async(req, res)=>{
    try{
        const {email, password} = req.body
        const user = await User.findOne({email})
        if(!user){
            return res.status(400).json({message: 'Invalid email or password'})
            }
            const isMatch = await bcrypt.compare(password,user.password )
            if(!isMatch){
                return res.status(400).json({message: 'Invalid email or password'})
                }
                const token = jwt.sign({user_id:user._id}, JWT_SECRET_KEY)
                res.json({
                    message: 'Logged in successfully',
                    token})
    }
    catch(err){
        res.status(500).json({message:err.message})
    }
})

router.post('/sendotp', async (req, res)=>{
    try{
        const {email} = req.body
        const otp = Math.floor(100000 + Math.random() * 900000)
        const mailOptions = {
            from: process.env.COMPANY_NAME,
            to: email,
            subject: 'otp for verification',
            text: `your otp is ${otp}`
        }
        transporter.sendMail(mailOptions, async (err, info)=>{
            if(err){
                res.status(500).json({
                    message:err.message
                })
            }
            else{
                const user = await User.findOne({email})
                if(!user){
                    return res.status(400).json({message: 'Invalid email or password'})
                    }
                    user.otp = otp
                    await user.save()
                res.json({
                    user,
                    message: 'otp sent successfully'
                })
            }
        })
    }
    catch(err){
        res.json({
            message: err.message
        })
    }
})

router.post('/changepassword',async(req, res)=>{
    try{
        const {email, newpassword, otp} = req.body
        const user = await User.findOne({email})
        if(!user){
            return res.status(400).json({message: 'Invalid email or password'})
        }
        if(user.otp !== otp){
            return res.status(400).json({message: 'Invalid otp'})
            }
            user.password = newpassword
            user.otp = null
            await user.save()
            res.json({
                message: 'password changed successfully'
                })
    }
    catch(err){
        res.status(500).json({message:err.message})
    }
})


module.exports = router