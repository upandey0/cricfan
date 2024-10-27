const express = require('express')
const router = require('./routes/currentMatchRoutes')
const contestRouter = require('./routes/contestRoutes')
const redis = require('redis')
const {syncDB} = require('./config/db')
require('./utility/AutoContestCreation')
// require('./utility/UpcomingToLiveHandle')

const app = express()



app.use(express.json())

app.get('/health', (req,res)=>{
    res.send('Server is Healthy at this moment')
})

app.use('/api/amtches',router)
app.use('/api/contests', contestRouter)


syncDB().then(() => {
    app.listen(8000, () => {
        console.log('Server started on http://localhost:8000');
    });
});