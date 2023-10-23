const express = require('express')
const pool = require('../db') 
const app = express()
const router = express.Router()
const multer = require('multer')
const storage = multer.memoryStorage()
const upload = multer({storage: storage})
const firebase = require('../firebase')
const jwt = require("jsonwebtoken")


router.route('/').post(upload.single(), async(req, res)=>{
    const {email, password} = req.body
    firebase.auth().signInWithEmailAndPassword(email, password).then(async function(userCredential){
        let userInfo = await pool.query(
            "SELECT * FROM userinfo WHERE email = $1", [email]
        )
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
        console.error(error)
    })

})
module.exports = router;