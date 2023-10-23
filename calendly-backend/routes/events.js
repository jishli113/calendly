const express = require('express')
const pool = require('../db') 
const app = express()
const router = express.Router()
const multer = require('multer')
const { PutObjectCommand, S3Client, GetObjectCommand } = require("@aws-sdk/client-s3")
const storage = multer.memoryStorage()
const upload = multer({storage: storage})
const { Temporal } = require('@js-temporal/polyfill')
const { getSignedUrl } = require("@aws-sdk/s3-request-presigner");
const cors = require('cors')
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

router.route('/').post(upload.single('eventImage'), async(req,res)=>{
    try {
        const {dates, sh:startHour, sm:startMinute,eh:endHour, em:endMinute, eventName, username, selectedTags, active} = req.body
        req.file.buffer
        let imageKey = randomName()
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
        res.json({status:"success"})
    } catch (error) {
        console.error(error.message)
        res.json({status:"failed"})
    }
})
router.route('/:username').get(async(req,res)=>{
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
router.route('/names/:username').get(async(req,res)=>{
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
router.route('/daily').post(async(req,res)=>{
    try {
        const {username, date} = req.body
        let month = parseInt((date.substring(5,7) == '0') ? date.substring(5,6) : date.substring(5,7))
        let day = parseInt((date.substring(8,10) == '0') ? date.substring(8,9) : date.substring(8,10))
        let year = parseInt(date.substring(0,4))
        let temp = new Temporal.PlainDateTime(year, month, day)
        temp = temp.add({days: 1})
        let date2 = temp.toString().substring(0,10)
        const response = await pool.query(
            "SELECT * FROM eventstats INNER JOIN (SELECT * FROM events WHERE username = $1 AND ($2 = ANY(json_array_to_text_array(events.dates)) OR $3 = ANY(json_array_to_text_array(events.dates))))e ON eventstats.username = e.username AND eventstats.eventname = e.eventname",[username, date, date2]
        )
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
        res.json(response.rows)
    } catch (error) {
        console.error(error.message)
    }
})
router.route('/feed').post(async(req,res)=>{
    try {
        const {username, date} = req.body
        const response = await pool.query(
            "SELECT * FROM events INNER JOIN (SELECT following.forusername FROM following WHERE followingusername = $1) feedusers ON events.username = feedusers.forusername AND events.active = true AND $2 = ANY(json_array_to_text_array(events.dates)) INNER JOIN (SELECT * FROM eventstats)e ON events.username = e.username AND events.eventname = e.eventname",[username, date]
        )
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
        res.json(response.rows)
    } catch (error) {
        console.error(error)
    }
})
router.route('/incrementlike').post(async(req,res)=>{
    try{
        const {username} = req.username
        const {eventusername, eventname} = req.body
        const response = await pool.query(
        "UPDATE eventstats SET likes = ARRAY_APPEND(likes, $1) WHERE username = $2 AND eventname = $3", [username, eventusername, eventname])
        res.json(200)
    }
    catch(error){
        console.error(error.message)
    }
    
})
router.route('/decrementlike').post(async(req,res)=>{
    try{
        const {username} = req.username
        const {eventusername, eventname} = req.body
        const response = await pool.query(
        "UPDATE eventstats SET likes = ARRAY_REMOVE(likes, $1) WHERE username = $2 AND eventname = $3", [username, eventusername, eventname])
        res.json(200)
    }
    catch(error){
        console.error(error.message)
    }
})

module.exports = router;