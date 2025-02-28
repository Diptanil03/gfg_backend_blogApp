const jwt = require('jsonwebtoken')
const  User = require('../models/User')

const auth = async (req, res, next)=>{
    try {
        const token = req.header('Authorization')
        const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY)
        // res.json({
        //     decoded
        // })
        const user = await User.findOne({
            _id: decoded.user_id
            })
            if(!user) {
                throw new Error('User not found')
                }
                req.user = user
                req.token = token
                next()
    }
    catch(err){
        res.status(401).send({error: 'Please authenticate.'})
    }
}

module.exports = auth