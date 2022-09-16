const mongoose = require('mongoose')
require('dotenv').config()


/**
 * connectin to db with provided url
 */
let MONGODB_URL = "";
if (process.env.NODE_ENV === "test")
    MONGODB_URL = process.env.MONGODB_URL_TEST
else 
    MONGODB_URL = process.env.MONGODB_URL
mongoose.connect(MONGODB_URL, {
    useNewUrlParser: true,
    // below code is unsupported for vmongodb > 6
    // useCreateIndex: true 
}).then(() => {
    console.log("database connected !!")
}).catch((e) => {
    console.log("database connection error: "+e)
})