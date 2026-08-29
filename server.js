const express = require('express')
const memberRoutes = require('./routes/memberRoutes')
const requestRoutes = require('./routes/requestRoutes')

const app = express()
const port = 6767

app.set('view engine', 'ejs')
app.use(express.urlencoded({ extended: true }))

app.use('/', memberRoutes)
app.use('/', requestRoutes)

app.listen(port, () => {
    console.log(`app listening on http://localhost:${port}`)
})