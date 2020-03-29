const express = require('express')
const cors = require('cors')
const findWeather = require('./location.js')

const app = express()

app.use(cors())

app.get('', (req,res) => {
    res.send('<h1>Running<h1>')
})

app.get('/weather', async (req,res) => {
    forecast = await findWeather(req.query.location)
    console.log(forecast)
    res.json(forecast)
})

app.listen(9000)