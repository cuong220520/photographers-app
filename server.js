const express = require('express')
const app = express()
const fileUpload = require('express-fileupload')

const connectDB = require('./config/db')

// connect DB
connectDB()

// init middleware 
app.use(express.json({ extended: false }))
app.use(fileUpload())
app.use('/uploads', express.static('uploads'))

app.get('/', (req, res) => {
    res.send('API running')
})

// define routes
app.use('/api/users', require('./routes/api/user'))
app.use('/api/auth', require('./routes/api/auth'))
app.use('/api/profile', require('./routes/api/profile'))
app.use('/api/post', require('./routes/api/post'))

const PORT = process.env.PORT || 6000

app.listen(PORT, () => console.log(`Server started on port ${PORT}`))