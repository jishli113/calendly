const express = require('express')
const app = express()
const router = express.Router()
const multer = require('multer')
const { PutObjectCommand, S3Client, GetObjectCommand } = require("@aws-sdk/client-s3")
const storage = multer.memoryStorage()
const upload = multer({storage: storage})
const pool = require('../db') 
const firebase = require('../firebase')

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



router.route('/default').post(upload.single(), async (req,res) =>{
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
            await pool.query("INSERT into settings (username, private) VALUES($1, true)", [username])
        return res.json({status:"success", data:newUser.rows[0]})
    }).catch(function(error){
        console.error(error.message)
        (error.code, "ERRORCODE")
        let msg = "Registration Failed"
        if (error.code === "auth/email-already-in-use"){
            msg = "Email already has an account registered"
        }
        res.json({status:"failed", message:msg})
    })
})
router.route('/').post(upload.single('pfpimg'), async (req,res) =>{
    const {username, firstname, lastname, password, email} = req.body
    let uid = undefined
    firebase.auth().createUserWithEmailAndPassword(email, password).then(async (userCredential)=>{
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
        let msg = "Registration Failed"
        if (error.code === "auth/email-already-in-use"){
            msg = "Email already has an account registered"
        }
        res.json({status:"failed", message:msg})
    })
})

module.exports = router;