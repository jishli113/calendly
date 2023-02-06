const Pool = require('pg').Pool
const pool = new Pool({
    user:"joshuali",
    password:"joshuali123",
    host:"localhost",
    port:5432,
    database:"calendly",
})

module.exports = pool;