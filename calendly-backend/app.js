
const express = require('express')
const app = express()
const cors = require('cors')
const pool = require('./db')
const { DatabaseFillSlash } = require('react-bootstrap-icons')
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
app.post('/api/createevent/:username', async(req,res)=>{
    const {username} = req.params
    
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
app.post(`/api/createevent`, async(req,res)=>{
    try {
        const {dates, sh:startHour, sm:startMinute,eh:endHour, em:endMinute, eventName, username, selectedTags} = req.body
        console.log(dates)
        const response = await pool.query(
            "INSERT INTO events (username, dates, starthour, startminute, endhour, endminute, eventname, selectedtags) VALUES($1, $2, $3, $4, $5, $6, $7, $8)",[username, dates, startHour, startMinute, endHour, endMinute, eventName, selectedTags]
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
        console.log(date)
        const response = await pool.query(
            "SELECT * FROM events WHERE username = $1 AND $2 = ANY(dates)",[username, date]
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
