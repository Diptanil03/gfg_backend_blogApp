const express = require('express')
const bodyParser = require('body-parser')
const cors = require('cors')
const app = express()
const port = 8000
require('./db')
const userRoutes = require('./routes/authRoutes')
const blogRoutes = require('./routes/blogRoutes')

app.use(cors())
app.use(bodyParser.json())
app.use('/user',userRoutes)
app.use('/blog',blogRoutes)

app.get('/',(req, res)=>{
    res.json({
        message: 'Welcome to the API'
    })
})

app.listen(port, ()=>{
    console.log(`Server is running on port ${port}`)
})