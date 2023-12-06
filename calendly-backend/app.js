
const express = require('express')
const multer = require('multer')
const crypto = require('crypto')
const bodyParser = require('body-parser')
const app = express()
app.use(express.json())
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())
const cors = require('cors')
const dotenv = require('dotenv')
dotenv.config()

const cookieParser = require('cookie-parser')
const jwt = require("jsonwebtoken")
app.use(cookieParser())

//Managing Routes
const commentsRoute = require('./routes/comments')
const eventsRoute = require('./routes/events')
const registerRoute = require('./routes/register')
const tagsRoute = require('./routes/tags')
const usersRoute = require('./routes/users')
const loginRoute = require('./routes/login')

const corsOptions = {
    origin:'http://localhost:3000',
    credentials:true,
    optionSuccessStatus:200,
    methods: ["POST", "PUT", "GET", "OPTIONS", "HEAD", "PATCH", "DELETE"],
      
}


app.use(cors(corsOptions))
app.use(express.json())
app.use(express.urlencoded({extended:false}))
app.all('*',function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "http://localhost:3000");
    res.header("Access-Control-Allow-Headers", "X-Requested-With");
    next();
    });


const authorization = (req,res, next)=>{
    const token = req.cookies.access_token
    if (!token){
        return res.send({status:"failed"})
    }
    else{
        try{
            const data = jwt.verify(token, process.env.JWT_TOKEN_SECRET_KEY)
            req.username = data.username
            req.email = data.email
            return next()
        }
        catch(error){
            console.error("auth", error.message)
        }
    }
}

app.use(function (err, req, res, next) {
    if (err instanceof multer.MulterError) {
      res.statusCode = 400;
      res.send(err.code);
    } else if (err) {
      if (err.message === "FILE_MISSING") {
        res.statusCode = 400;
        res.send("FILE_MISSING");
      } else {
        res.statusCode = 500;
        res.send("GENERIC_ERROR");
      }
    }
  });

app.use('/api/login', loginRoute)
app.use('/api/comments', authorization, commentsRoute)
app.use('/api/register', authorization, registerRoute)
app.use('/api/events', authorization, eventsRoute)
app.use('/api/tags', authorization, tagsRoute)
app.use('/api/users', usersRoute)







const defaultProfilePictureCode = "SECRET_DEFAULT_PFP_IMG_CODE_S3"

const randomName = (bytes = 32) => crypto.randomBytes(bytes).toString()

app.post('/authenticate', authorization, (req,res)=>{
    res.send({status:"success"})
})

app.get('/cookieinfo', authorization, (req,res)=>{
    return(res.json({user:{username:req.username, email: req.email}}))
})
 



app.listen(4000,()=>{
    console.log("started on 4000")
})
module.exports = app