
const express = require('express')
const multer = require('multer')
const crypto = require('crypto')
const app = express()
app.use(express.json())
const cors = require('cors')
const pool = require('./db') 
const { PutObjectCommand, S3Client, GetObjectCommand } = require("@aws-sdk/client-s3")
const dotenv = require('dotenv')
dotenv.config()

const { getSignedUrl } = require("@aws-sdk/s3-request-presigner");
const { Temporal } = require('@js-temporal/polyfill')



const storage = multer.memoryStorage()
const upload = multer({storage: storage})

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
    origin:'*',
    credentials:true,
    optionSuccessStatus:200,
}


app.use(cors(corsOptions))
app.use(express.json())
app.use(express.urlencoded({extended:false}))
app.all('*',function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "X-Requested-With");
    next();
    });



app.get('/api/users', async (req,res) =>{
    try{
        const allUsers = await pool.query(
            "SELECT * FROM users"
        );
        res.json(allUsers.rows);
    }
    catch(err){
        console.log(err.message)
    }
})
app.post('/api/users', async (req,res) =>{
    try{
        const {username, firstname, lastname, loggedin, password, followers, following} = req.body
        const newUser = await pool.query(
            "INSERT INTO users (username, firstname, lastname, loggedin, password, followers, following) VALUES($1,$2,$3,$4,$5,$6,$7)", [username,firstname,lastname,loggedin, password, followers, following]
        );
        res.json(newUser.rows[0])
    }
    catch(err){
        console.log(err.message)
    }
})
app.get('/api/users/:username', async(req,res)=>{
    try{
        const {username} = req.params
        const user = await pool.query(
            "SELECT * FROM users WHERE username = $1",[username]
        )
        res.json(user.rows)
    }
    catch(err){
        console.log(err.message)
    }
})
app.patch('/api/users/loggedin/:username/:loggedin', async(req,res) =>{
    try {
        const {username, loggedin} = req.params
        const operation = await pool.query(
            "UPDATE users SET loggedin = $1 WHERE username = $2",[loggedin, username]
        )
        res.json(operation)
    } catch (error) {
        console.error(error.message)
    }
})
app.patch('/api/incfollowers/:username',async(req,res)=>{
    try {
        const {username} = req.params
        const updateVals = await pool.query(
            "UPDATE users SET followers = followers + 1 WHERE username = $1",[username]
        )
    } catch (error) {
        console.error(error.message)
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
app.patch('/api/decfollowers/:username',async(req,res)=>{
    try {
        const {username} = req.params
        const updateVals = await pool.query(
            "UPDATE users SET followers = followers - 1 WHERE username = $1",[username]
        )
    } catch (error) {
        console.error(error.message)
    }
})
app.delete("/api/users/:username", async(req,res)=>{
    try {
        const {username} = req.params
        const del = await pool.query(
            "DELETE FROM followers WHERE forusername = $1; DELETE FROM following WHERE forusername = $1;",[username])
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

app.get("/api/followers/:username", async(req,res)=>{
    try{
        const {username} = req.params
        const response = await pool.query(
            "SELECT * FROM followers WHERE forusername = $1",[username]
        )
        res.json(response.rows)
    }
    catch(error){
        console.error(error.message)
    }
})
app.get("/api/following/:username", async(req,res)=>{
    try{
        const {username} = req.params
        const response = await pool.query(
            "SELECT * FROM following WHERE forusername = $1",[username]
        )
        res.json(response.rows)
    }
    catch(error){
        console.error(error.message)
    }
})

app.post('/api/follow/:follower/:followed',async(req,res)=>{
    try {
        const {follower, followed} = req.params
        const response = await pool.query(
            "INSERT INTO following (forusername, followingusername) VALUES($1,$2)",[follower, followed]
        )
        const response2 = await pool.query(
            "INSERT INTO followers (forusername, followerusername) VALUES($1,$2)",[followed, follower]
        )
        res.json(response.rows)
    } catch (error) {
        console.error(error.message)
    }
})
app.delete('/api/unfollow/:unfollower/:beingunfollowed',async(req,res)=>{
    try {
        const {unfollower, beingunfollowed} = req.params
        const response = await pool.query(
            "DELETE FROM following WHERE forusername = $1 AND followingusername = $2",[unfollower, beingunfollowed]
        )
        const response2 = await pool.query(
            "DELETE FROM followers WHERE forusername = $1 AND followerusername = $2",[beingunfollowed, unfollower]
        )
        res.json(response.rows)
    } catch (error) {
        console.error(error.message)
    }
})



app.get('/api/following/:username', async(req,res)=>{
    try{
        const {username} = req.params
        console.log("pdfs")
        const response = await pool.query(
            "SELECT * FROM following WHERE forusername = $1",[username]
        )
        res.json(response.rows)
    }
    catch(err){
        console.log(err.message)
    }
})
app.get('/api/followers/:username',async(req,res)=>{
    try {
        const {username} = username
        const response = await pool.query(
            "SELECT * FROM followers WHERE forusername = $1",[username]
        )
        res.json(response.rows)
        
    } catch (error) {
        console.log(error.message)
    }
})
app.get('/api/following/:forusername/:followingusername', async(req,res)=>{
    try {
        const {forusername, followingusername} = req.params
        const response = await pool.query(
        "SELECT * FROM following WHERE forusername = $1 AND followingusername = $2",[forusername, followingusername]
    )
    res.json(response.rows)
    } catch (error) {
        console.error(error.message)
    }
})
app.get(`/api/followingcount/:username`,async(req,res)=>{
    try {
        const {username} = req.params
        const response = await pool.query(
            "SELECT COUNT(forusername) FROM following WHERE forusername = $1",[username]
        )
        res.json(response.rows)
    } catch (error) {
        console.error(error.message)
    }
})
app.get(`/api/followercount/:username`,async(req,res)=>{
    try {
        const {username} = req.params
        const response = await pool.query(
            "SELECT COUNT(forusername) FROM followers WHERE forusername = $1",[username]
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
// app.get('/api/follower-following-count/:username',async(req,res)=>{
//     try {
//         const {username} = req.params
//         const response = await pool.query(
//             "SELECT * FROM users WHERE username = $1",[username]
//         )
//     } catch (error) {
//         console.error(error.message)
//     }
// })
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
        console.log("adsgasgas")
        console.log(req.body, "body")
        console.log(req.file, "file")
        const {dates, sh:startHour, sm:startMinute,eh:endHour, em:endMinute, eventName, username, selectedTags} = req.body
        req.file.buffer
        console.log(req.body)
        let imageKey = randomName()
        console.log("imagekey", imageKey)
        const params = {
            Bucket:bucketName,
            Key:imageKey,
            Body: req.file.buffer,
            ContentType: req.file.mimetype,
        }

        const command = new PutObjectCommand(params)
        await s3.send(command)
        const response = await pool.query(
            "INSERT INTO events (username, dates, starthour, startminute, endhour, endminute, eventname, selectedtags, imageKey) VALUES($1, $2, $3, $4, $5, $6, $7, $8, $9)",[username, dates, startHour, startMinute, endHour, endMinute, eventName, selectedTags, imageKey]
        )
        res.json(response.rows)
    } catch (error) {
        console.error(error.message)
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
app.get(`/api/dailyevents/:username/:date`, async(req,res)=>{
    try {
        const {username, date} = req.params
        let month = parseInt((date.substring(5,7) == '0') ? date.substring(5,6) : date.substring(5,7))
        let day = parseInt((date.substring(8,10) == '0') ? date.substring(8,9) : date.substring(8,10))
        let year = parseInt(date.substring(0,4))
        let temp = new Temporal.PlainDateTime(year, month, day)
        console.log(year, month, day)
        temp = temp.add({days: 1})
        let date2 = temp.toString().substring(0,10)
        console.log(date2)
        const response = await pool.query(
            "SELECT * FROM events WHERE username = $1 AND ($2 = ANY(json_array_to_text_array(events.dates)) OR $3 = ANY(json_array_to_text_array(events.dates)))",[username, date, date2]
        )
        const tz = Temporal.Now.timeZone()
        for (e in response.rows){
            console.log(response.rows[e])
            const getObjectParams = {
                Bucket: bucketName,
                Key: response.rows[e].imagekey
            }
            const command = new GetObjectCommand(getObjectParams);
            const url = await getSignedUrl(s3, command, { expiresIn: 3600 });
            response.rows[e].eventurl = url
        }
        console.log(response.rows)
        res.json(response.rows)
    } catch (error) {
        console.error(error.message)
    }
})


app.listen(4000,()=>{
    console.log("started on 4000")
})
module.exports = app
