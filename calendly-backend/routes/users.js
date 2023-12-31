var express = require('express');
const app = express()
var router = express.Router();
const pool = require('../db') 
const firebase = require('../firebase')
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

router.route('/info').post(async(req,res)=>{
  try{
      const {username} = req.body
      const user = await pool.query(
          "SELECT * FROM userinfo WHERE username = $1",[username]
      )
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
      console.error(err.message)
  }
})
router.patch('/incfollowing/:username').patch(async(req,res)=>{
  try {
      const {username} = req.params
      const updateVals = await pool.query(
          "UPDATE users SET following = following + 1 WHERE username = $1",[username]
      )
  } catch (error) {
      console.error(error.message)
  }
})
router.route('/decfollowing/:username').patch(async(req,res)=>{
  try {
      const {username} = req.params
      const updateVals = await pool.query(
          "UPDATE users SET following = following - 1 WHERE username = $1",[username]
      )
  } catch (error) {
      console.error(error.message)
  }
})
router.route('/').delete(async(req,res)=>{
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

router.route('/followers').post(async(req,res)=>{
  try{
      const {username} = req.body
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
router.route('/following').post(async(req,res)=>{
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
router.route('/isfollowing').post(async(req,res)=>{
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

router.route('/follow').post(async(req,res)=>{
  try {
      const {follower, followed} = req.body
      let ispriv = await pool.query(
        "SELECT private FROM settings WHERE username = $1", [followed]
      )
      let response = undefined
      console.log(ispriv.rows)
      if (ispriv.rows[0].private === true){
            response = await pool.query(
            "INSERT INTO followrequests (requester, requested) VALUES($1, $2)", [follower, followed]
        )
      }
      else{
            response = await pool.query(
            "INSERT INTO following (forusername, followingusername) VALUES($1,$2)",[followed, follower]
        )
        const msg = `${follower} started following you.`
        await pool.query(
            "INSERT INTO eventnotifications (for, interactor, seen, message, ts) VALUES($1, $2, $3, $4, NOW() AT TIME ZONE 'UTC')", [followed, follower, false, msg]
        )
      }
      res.json(response.rows)
  } catch (error) {
      console.error(error.message)
  }
})
router.route('/unfollow').delete(async(req,res)=>{
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

router.route('/followingcount').post(async(req,res)=>{
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
router.route('/followercount').post(async(req,res)=>{
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
router.route('/all').get(async (req,res) =>{
    try{
        const allUsers = await pool.query(
            "SELECT * FROM users"
        );
        res.json(allUsers.rows);
    }
    catch(error){
        console.error(error.message)
    }
})
router.route('/logout').post(async (req,res)=>{
    try{
        firebase.auth().signOut().then(()=>{
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
router.route('/isprivate').post(async(req,res)=>{
    try {
        const {username} = req.body
        let response = await pool.query(
            "SELECT * FROM settings WHERE username = $1", [username]
        );
        res.json(response.rows[0].private)
        
    } catch (error) {
        console.error(error.message)
    }

})
router.route('/followrequests').post(async(req,res)=>{
    try {
        const {username} = req.body
        let r = await pool.query(
            "SELECT * FROM followrequests WHERE requested = $1",[username]
        )
        console.log(r.rows)
        res.json(r.rows)
    } catch (error) {
        console.error(error.message)
    }
})
router.route('/acceptfollowrequest').post(async(req,res)=>{
    try {
        console.log(">??")
        const {requester, requested} = req.body
        let r = await pool.query(
            "DELETE FROM followrequests WHERE requester = $1 AND requested = $2",[requester, requested]
        )
        let r2 = await pool.query(
            "INSERT INTO following (forusername, followingusername) VALUES($1, $2)",[requested, requester]
        )
        const msg = `${requester} started following you.`
        console.log(msg)
        await pool.query(
            "INSERT INTO eventnotifications (forusername, interactor, seen, message, ts) VALUES($1, $2, $3, $4, NOW() AT TIME ZONE 'UTC')", [requested, requester, false, msg]
        )
        res.sendStatus(200)
    } catch (error) {
        console.error(error.message)
    }
})
router.route('/declinefollowrequest').post(async(req,res)=>{
    try {
        const {requester, requested} = req.body
        let r = await pool.query(
            "DELETE FROM followrequests WHERE requester = $1 AND requested = $2",[requester, requested]
        )
    } catch (error) {
        console.error(error.message)
    }
})
router.route('/notifications').post(async(req, res)=>{
    try {
        const{username} = req.body
        let r = await pool.query(
            "SELECT * FROM eventnotifications WHERE forusername = $1 ORDER BY ts", [username]
        )
        res.json(r.rows)
    } catch (error) {
        console.error(error.message)
    }
})

router.route('/')

module.exports = router;
