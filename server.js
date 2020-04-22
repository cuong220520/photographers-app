const express = require('express')
const app = express()

const connectDB = require('./config/db')

// connect DB
connectDB()

const PORT = process.env.PORT || 5000

app.get('/', (req, res) => {
    res.send('API running')
})

app.listen(PORT, () => console.log(`Server started on port ${PORT}`))