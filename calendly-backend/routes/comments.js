const express = require('express')
const app = express()
const router = express.Router()
const pool = require('../db') 
const { PutObjectCommand, S3Client, GetObjectCommand } = require("@aws-sdk/client-s3")
const { getSignedUrl } = require("@aws-sdk/s3-request-presigner");

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

router.route('/retrieve').post(async(req,res)=>{
    try {
        const {username, eventname} = req.body
        const response = await pool.query(
            "SELECT * FROM parse_comments($1, $2)", [eventname, username]
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
    } catch (error) {
        console.error(error.message)
    }
})
router.route('/').post(async(req,res)=>{
    try {
        const username = req.username
        const {comment, eventusername, eventname} = req.body
        const response = await pool.query(
            `UPDATE eventstats SET usercomments = (usercomments::jsonb || '{"username":"${username}", "comment":"${comment}"}'::jsonb) WHERE username = $1 AND eventname = $2`, [eventusername, eventname]
        )
        res.json({status:"success"})
    } catch (error) {
        console.error(error.message)
        res.json({status:"failed"})
    }
})

module.exports = router