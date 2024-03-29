const express = require('express')
const app = express()
const router = express.Router()
const pool = require('../db') 
const cors = require('cors')
const corsOptions = {
    origin:'http://localhost:3000',
    credentials:true,
    optionSuccessStatus:200,
    methods: ["POST", "PUT", "GET", "OPTIONS", "HEAD", "PATCH", "DELETE"],
      
}

router.route('/').post(async(req,res)=>{
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
router.route('/').get(async(req,res)=>{
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
router.route('/all').get(async(req,res)=>{
    try {
        const response = await pool.query(
            "SELECT * FROM tags"
        )
        res.json(response.rows)
    } catch (error) {
        console.error(error.message)
    }
})

router.route('/:username').get(async(req,res)=>{
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


module.exports = router