
const express = require('express')
const multer = require('multer')
const crypto = require('crypto')
const bodyParser = require('body-parser')
const app = express()
app.use(express.json())
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())
const cors = require('cors')
const pool = require('./db') 
const { PutObjectCommand, S3Client, GetObjectCommand } = require("@aws-sdk/client-s3")
const dotenv = require('dotenv')
dotenv.config()

const jwt = require("jsonwebtoken")
const { getSignedUrl } = require("@aws-sdk/s3-request-presigner");
const { Temporal } = require('@js-temporal/polyfill')
const cookieParser = require('cookie-parser')
app.use(cookieParser())

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


/*Firebase */
const firebase = require('firebase')
const firebaseConfig = {
    apiKey: "AIzaSyD-N5_DgGdxQ44AgojvdLHeZDOOdO6Cx2o",
    authDomain: "calendlyauth.firebaseapp.com",
    projectId: "calendlyauth",
    storageBucket: "calendlyauth.appspot.com",
    messagingSenderId: "951322701805",
    appId: "1:951322701805:web:df4ab4500c116f3a9ec1e4",
    measurementId: "G-3JXTRBM7HZ"
  };
firebase.initializeApp(firebaseConfig)

const storage = multer.memoryStorage()
const upload = multer({storage: storage})

const defaultProfilePictureCode = "SECRET_DEFAULT_PFP_IMG_CODE_S3"

const randomName = (bytes = 32) => crypto.randomBytes(bytes).toString()


const bucketName = process.env.AWS_BUCKET_NAME
const bucketRegion = process.env.AWS_BUCKET_REGION
const accessKey = process.env.AWS_ACCESS_KEY
const secretAccessKey = process.env.AWS_SECRET_ACCESS_KEY

const s3 = new S3Client({
    credentials:{
        accessKeyId:accessKey,
        secretAccessKey: secretAccessKey,
    },
    region: bucketRegion
});

const corsOptions = {
    origin:'http://localhost:3000',
    credentials:true,
    optionSuccessStatus:200,
    methods: ["POST", "PUT", "GET", "OPTIONS", "HEAD", "PATCH", "DELETE"],
      
}

const authorization = (req,res, next)=>{
    (req.cookies)
    (req.body, "AUTH")
    const token = req.cookies.access_token
    if (!token){
        return res.send({status:"failed"})
    }
    else{
        try{
            const data = jwt.verify(token, process.env.JWT_TOKEN_SECRET_KEY)
            (data, "data")
            req.username = data.username
            req.email = data.email
            return next()
        }
        catch(error){
            console.error("auth", error.message)
        }
    }
}

app.use(cors(corsOptions))
app.use(express.json())
app.use(express.urlencoded({extended:false}))
app.all('*',function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "http://localhost:3000");
    res.header("Access-Control-Allow-Headers", "X-Requested-With");
    next();
    });

app.post('/authenticate', authorization, (req,res)=>{
    res.send({status:"success"})
})

app.get('/cookieinfo', authorization, (req,res)=>{
    return(res.json({user:{username:req.username, email: req.email}}))
})

app.get('/test', (req,res)=>{
    (req.cookies.access_token)

})
 
app.get('/api/allusers', async (req,res) =>{
    try{
        const allUsers = await pool.query(
            "SELECT * FROM users"
        );
        res.json(allUsers.rows);
    }
    catch(error){
        (error.message)
    }
})
app.post('/api/register',  upload.single('pfpimg'), async (req,res) =>{
        const {username, firstname, lastname, password, email} = req.body
        (req.body, "BODY")
        (req.file, "file")
        let uid = undefined
        firebase.auth().createUserWithEmailAndPassword(email, password).then(async (userCredential)=>{
            req.file.buffer
            (req.body)
            let imageKey = randomName()
            const params = {
                Bucket:bucketName,
                Key:imageKey,
                Body: req.file.buffer,
                ContentType: req.file.mimetype,
            }
            const command = new PutObjectCommand(params)
            await s3.send(command)
            var user = userCredential.user
            uid = user.uid
            const newUser = await pool.query(
                "INSERT INTO users (username, uid) VALUES($1,$2)", [username,uid]
            );
            await pool.query(
                "INSERT into userinfo (username, firstname, lastname, email, pfpimg) VALUES($1, $2, $3, $4, $5)",[username, firstname, lastname, email, imageKey]
            )
            return res.json({status:"success", data:newUser.rows[0]})
        }).catch(function(error){
            console.error(error.message)
            (error.code, "ERRORCODEEEE")
            let msg = "Registration Failed"
            if (error.code === "auth/email-already-in-use"){
                msg = "Email already has an account registered"
            }
            res.json({status:"failed", message:msg})
        })
})
app.post('/api/registerdefault', upload.single(), async (req,res) =>{
    const {username, firstname, lastname, password, email} = req.body
    let uid = undefined
    firebase.auth().createUserWithEmailAndPassword(email, password).then(async (userCredential)=>{
        var user = userCredential.user
        uid = user.uid
        const newUser = await pool.query(
            "INSERT INTO users (username, uid) VALUES($1,$2)", [username,uid]
        );
            await pool.query(
                "INSERT into userinfo (username, firstname, lastname, email) VALUES($1, $2, $3, $4)",[username, firstname, lastname, email]
            )
        return res.json({status:"success", data:newUser.rows[0]})
    }).catch(function(error){
        console.error(error.message)
        (error.code, "ERRORCODEEEE")
        let msg = "Registration Failed"
        if (error.code === "auth/email-already-in-use"){
            msg = "Email already has an account registered"
        }
        res.json({status:"failed", message:msg})
    })
})
app.post('/api/what', async(req,res)=>{
    const {username, uid, firstname, lastname, email} = req.body
    await pool.query(
        "INSERT into userinfo (username, firstname, lastname, email) VALUES($1, $2, $3, $4)",[username, firstname, lastname, email]
    )
    const newUser = await pool.query(
        "INSERT INTO users (username, uid) VALUES($1,$2)", [username,uid]
    );
    res.json(200)
})
app.post('/api/login', upload.single(), async(req, res)=>{
    const {email, password} = req.body
    firebase.auth().signInWithEmailAndPassword(email, password).then(async function(userCredential){
        let userInfo = await pool.query(
            "SELECT * FROM userinfo WHERE email = $1", [email]
        )
        (userInfo.rows)
        const token = jwt.sign({username:userInfo.rows[0].username, email: userInfo.rows[0].email}, process.env.JWT_TOKEN_SECRET_KEY)
        return res.cookie("access_token", token, {httpOnly:true, maxAge:300000000, secure:false}).status(200).json(userInfo.rows)
    }).catch(function(error){
        var errorCode = error.code
        var errorMessage = error.message

        if (errorCode === 'auth/wrong-password'){
            res.json({status:"Failed"})
        }
        else{
             (errorMessage)
        }
        (error)
    })

})
app.post('/api/logout', authorization, async (req,res)=>{
    try{
        firebase.auth().signOut().then(()=>{
            ("huh")
            res.clearCookie("access_token", {httpOnly:true, maxAge:300000000, secure:false})
            res.status(200).json({deleted:"success"})
        }).catch((error)=>{
            console.error(error.message)
        })
    }
    catch(error){
        console.error(error.message)
    }
})
app.post('/api/userinfo', authorization, async(req,res)=>{
    try{
        const {username} = req.body
        const user = await pool.query(
            "SELECT * FROM userinfo WHERE username = $1",[username]
        )
        (user.rows, "ROW")
            const getObjectParams = {
                Bucket: bucketName,
                Key: user.rows[0].pfpimg
            }
            const command = new GetObjectCommand(getObjectParams);
            const url = await getSignedUrl(s3, command, { expiresIn: 3600 });
            user.rows[0].pfpimg = url
            res.json(user.rows)
    }
    catch(err){
        (err.message)
    }
})
app.patch('/api/incfollowing/:username',async(req,res)=>{
    try {
        const {username} = req.params
        const updateVals = await pool.query(
            "UPDATE users SET following = following + 1 WHERE username = $1",[username]
        )
    } catch (error) {
        console.error(error.message)
    }
})
app.patch('/api/decfollowing/:username',async(req,res)=>{
    try {
        const {username} = req.params
        const updateVals = await pool.query(
            "UPDATE users SET following = following - 1 WHERE username = $1",[username]
        )
    } catch (error) {
        console.error(error.message)
    }
})
app.delete("/api/users/", authorization, async(req,res)=>{
    try {
        const username = req.username
        const del = await pool.query(
            " DELETE FROM following WHERE forusername = $1;",[username])
        const del2 = await pool.query(
            "DELETE FROM users WHERE username = $1",[username]
        )
        const retrieveAll = await pool.query(
            "SELECT * FROM users"
        )
        res.json(retrieveAll.rows)
    } catch (error) {
        console.error(error.message)
    }
})

app.post("/api/followers", async(req,res)=>{
    try{
        const {username} = req.body
        (username)
        const response = await pool.query(
            "SELECT followingusername, pfpimg FROM userinfo INNER JOIN (SELECT followingusername FROM following WHERE forusername = $1) followings ON followings.followingusername = userinfo.username",[username]
        )
        for (e in response.rows){
            const getObjectParams = {
                Bucket: bucketName,
                Key: response.rows[e].pfpimg
            }
            const command = new GetObjectCommand(getObjectParams);
            const url = await getSignedUrl(s3, command, { expiresIn: 3600 });
            response.rows[e].pfpimg = url
        }
        res.json(response.rows)
    }
    catch(error){
        console.error(error.message)
    }
})
app.post("/api/following", authorization, async(req,res)=>{
    try{
        const {username} = req.body
        const response = await pool.query(
            "SELECT forusername, pfpimg FROM userinfo INNER JOIN (SELECT forusername FROM following WHERE followingusername = $1) followings ON followings.forusername = userinfo.username",[username]
        )
        for (e in response.rows){
            const getObjectParams = {
                Bucket: bucketName,
                Key: response.rows[e].pfpimg
            }
            const command = new GetObjectCommand(getObjectParams);
            const url = await getSignedUrl(s3, command, { expiresIn: 3600 });
            response.rows[e].pfpimg = url
        }
        res.json(response.rows)
    }
    catch(error){
        console.error(error.message)
    }
})
app.post("/api/isfollowing", authorization, async(req,res)=>{
    try{
        const {forusername, followingusername} = req.body
        const response = await pool.query(
            "SELECT followingusername FROM following WHERE forusername = $1 AND followingusername = $2",[forusername, followingusername]
        )
        res.json(response.rows)
    }
    catch(error){
        console.error(error.message)
    }
})

app.post('/api/follow/', async(req,res)=>{
    try {
        const {follower, followed} = req.body
        const response = await pool.query(
            "INSERT INTO following (forusername, followingusername) VALUES($1,$2)",[followed, follower]
        )
        res.json(response.rows)
    } catch (error) {
        console.error(error.message)
    }
})
app.delete('/api/unfollow/',async(req,res)=>{
    try {
        const {unfollower, beingunfollowed} = req.body
        const response = await pool.query(
            "DELETE FROM following WHERE forusername = $1 AND followingusername = $2",[unfollower, beingunfollowed]
        )
        res.json(response.rows)
    } catch (error) {
        console.error(error.message)
    }
})

app.post(`/api/followingcount/`,async(req,res)=>{
    try {
        const {username} = req.body
        const response = await pool.query(
            "SELECT COUNT(followingusername) FROM following WHERE followingusername = $1",[username]
        )
        res.json(response.rows)
    } catch (error) {
        console.error(error.message)
    }
})
app.post(`/api/followercount`,async(req,res)=>{
    try {
        const {username} = req.body
        const response = await pool.query(
            "SELECT COUNT(forusername) FROM following WHERE forusername = $1",[username]
        )
        res.json(response.rows)
    } catch (error) {
        console.error(error.message)
    }
})
app.get('/api/alltags', async(req,res)=>{
    const response = await pool.query(
        "SELECT * FROM tags"
    )
    res.json(response.rows)
})

app.post('/api/createtag', async(req,res)=>{
    try {
        const {tagName, tagcolor, username} = req.body
        const response = await pool.query(
            "SELECT checktag($2, $3, $1)",[username, tagName, tagcolor]
        )
        res.json(response.rows)
    } catch (error) {
        console.error(error.message)
    }


})
app.get('/api/gettag', async(req,res)=>{
    try {
        const {tagName, selectedTagColor, username} = req.params
        const response = await pool.query(
            "SELECT * FROM tags WHERE username=$1 AND tag=$2 AND tagcolor=$3",[username, tagName,selectedTagColor]
        )
        res.json(response)
    } catch (error) {
        console.error(error.message)
    }
})
app.get('/api/getalltags', async(req,res)=>{
    try {
        const response = await pool.query(
            "SELECT * FROM tags"
        )
        res.json(response.rows)
    } catch (error) {
        console.error(error.message)
    }
})
app.get('/api/getalltags/:username',async(req,res)=>{
    try {
        const {username} = req.params
        const response = await pool.query(
            "SELECT * FROM tags WHERE username=$1",[username]
        )
        res.json(response.rows)
    } catch (error) {
        console.error(error.message)
    }
})
app.post(`/api/createevent`, upload.single('eventImage'), async(req,res)=>{
    try {
        ("adsgasgas")
        (req.body, "body")
        (req.file, "file")
        const {dates, sh:startHour, sm:startMinute,eh:endHour, em:endMinute, eventName, username, selectedTags, active} = req.body
        req.file.buffer
        (req.body)
        let imageKey = randomName()
        ("imagekey", imageKey)
        const params = {
            Bucket:bucketName,
            Key:imageKey,
            Body: req.file.buffer,
            ContentType: req.file.mimetype,
        }
        const command = new PutObjectCommand(params)
        await s3.send(command)
        const response = await pool.query(
            "INSERT INTO events (username, dates, starthour, startminute, endhour, endminute, eventname, selectedtags, imageKey, active) VALUES($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)",[username, dates, startHour, startMinute, endHour, endMinute, eventName, selectedTags, imageKey, active]
        )
        ("sdfaf")
        res.json({status:"success"})
    } catch (error) {
        console.error(error.message)
        ("adsfas")
        res.json({status:"failed"})
    }
})
app.get(`/api/getevents/:username`, async(req,res)=>{
    try {
        const {username} = req.params
        const response = await pool.query(
            "SELECT * FROM events WHERE username = $1",[username]
        )
        res.json(response.rows)
    } catch (error) {
        console.error(error.message)
    }
})
app.get(`/api/geteventnames/:username`, async(req,res)=>{
    try {
        const {username} = req.params
        const response = await pool.query(
            "SELECT eventname FROM events WHERE username = $1",[username]
        )
        res.json(response.rows)
    } catch (error) {
        console.error(error.message)
    }
})
app.post(`/api/dailyevents/`, async(req,res)=>{
    try {
        const {username, date} = req.body
        let month = parseInt((date.substring(5,7) == '0') ? date.substring(5,6) : date.substring(5,7))
        let day = parseInt((date.substring(8,10) == '0') ? date.substring(8,9) : date.substring(8,10))
        let year = parseInt(date.substring(0,4))
        let temp = new Temporal.PlainDateTime(year, month, day)
        (year, month, day)
        temp = temp.add({days: 1})
        let date2 = temp.toString().substring(0,10)
        (date2)
        const response = await pool.query(
            "SELECT * FROM eventstats INNER JOIN (SELECT * FROM events WHERE username = $1 AND ($2 = ANY(json_array_to_text_array(events.dates)) OR $3 = ANY(json_array_to_text_array(events.dates))))e ON eventstats.username = e.username AND eventstats.eventname = e.eventname",[username, date, date2]
        )
        (response, "response")
        const tz = Temporal.Now.timeZone()
        for (e in response.rows){
            const getObjectParams = {
                Bucket: bucketName,
                Key: response.rows[e].imagekey
            }
            const command = new GetObjectCommand(getObjectParams);
            const url = await getSignedUrl(s3, command, { expiresIn: 3600 });
            response.rows[e].eventurl = url
        }
        response.rowCount
        res.json(response.rows)
    } catch (error) {
        console.error(error.message)
    }
})
app.post(`/api/feedevents`, async(req,res)=>{
    try {
        const {username, date} = req.body
        (username, date)
        const response = await pool.query(
            "SELECT * FROM events INNER JOIN (SELECT forusername FROM following WHERE followingusername = $1) feedusers ON events.username = feedusers.forusername AND events.active = true AND $2 = ANY(json_array_to_text_array(events.dates)) INNER JOIN (SELECT * FROM eventstats)e ON events.username = e.username AND events.eventname = e.eventname",[username, date]
        )
        (response.rows, "res")
        for (e in response.rows){
            (response.rows[e])
            const getObjectParams = {
                Bucket: bucketName,
                Key: response.rows[e].imagekey
            }
            const command = new GetObjectCommand(getObjectParams);
            const url = await getSignedUrl(s3, command, { expiresIn: 3600 });
            response.rows[e].eventurl = url
        }
        (response.rows)
        res.json(response.rows)
    } catch (error) {
        console.error(error)
    }
})
app.get('/api/b', (req,res)=>{
    (randomName())
    res.json({successs:'yes'})
})

app.listen(4000,()=>{
    ("started on 4000")
})
module.exports = app
