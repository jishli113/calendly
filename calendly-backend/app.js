
const express = require('express')
const app = express()
const cors = require('cors')
const pool = require('./db')
const corsOptions = {
    origin:'*',
    credentials:true,
    optionSuccessStatus:200,
}


app.use(cors(corsOptions))
app.use(express.json())
app.use(express.urlencoded({extended:false}))
app.use(function(req, res, next) {
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
    console.log(req.method)
    try{
        const {username, firstname, lastname, loggedin, password, followers, following} = req.body
        console.log(firstname)
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
app.patch('/api/users/loggedin/:username/', async(req,res) =>{
    try {
        const {username} = req.params
        const {loggedin} = req.body
        console.log(username, loggedin)
        const operation = await pool.query(
            "UPDATE users SET loggedin = $1 WHERE username = $2",[loggedin, username]
        )
        res.json(operation)
    } catch (error) {
        console.error(error.message)
    }
})


app.delete("/api/users/:username", async(req,res)=>{
    try {
        const {username} = req.params
        const del = await pool.query(
            "DELETE FROM users WHERE username = $1",[username])
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
        console.log(follower, followed)
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
        const {follower, followed} = req.params
        const response = await pool.query(
            "DELETE FROM following WHERE forusername = $1 AND followingusername = $2)",[follower, followed]
        )
        const response2 = await pool.query(
            "DELETE FROM followers WHERE forusername = $2 AND followingusername = $1",[followed, follower]
        )
        res.json(response.rows)
    } catch (error) {
        console.error(error.message)
    }
})
app.get('/api/following/:username', async(req,res)=>{
    try{
        const {username} = req.params
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
app.listen(4000,()=>{
    console.log("started on 4000")
})
module.exports = app
