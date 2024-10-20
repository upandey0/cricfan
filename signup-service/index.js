const express = require('express')
const router = require('./Routers/Signup')
const {Pool} = require('pg')
const secrets = require('./configs/config.json')
const {syncDB} = require('./configs/db')


const app = express()

app.use(express.json())


//console.log(pool)

app.get('/', (req,res)=>{
    res.status(200).json({
        success: true,
        status : "Healthy"
    })
})

app.use('/v1/api', router)

syncDB().then(() => {
    app.listen(8000, () => {
        console.log('Server started on http://localhost:8000');
    });
});