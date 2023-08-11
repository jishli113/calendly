const Pool = require('pg').Pool
const pool = new Pool({
    user:"joshuali",
    password:"joshuali123",
    host:"localhost",
    port:5433,
    database:"calendly",
})

module.exports = pool;