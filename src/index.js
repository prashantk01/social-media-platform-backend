const app = require('./app')
require('dotenv').config()
const port = process.env.PORT


app.use('/test', (req,res) => {
    res.send('platform is up and running');
})

app.listen(port, () => {
    console.log('Server is up on port ' + port)
})