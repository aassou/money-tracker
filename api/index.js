const express = require('express')
const cors = require('cors')
const Transaction = require('./models/Transaction')
const mongoose = require('mongoose')
const dotenv = require('dotenv')
const app = express()
const port = 4000

dotenv.config()

app.use(cors())
app.use(express.json())
app.get('/api/test', (req, res) => {
    res.json('test ok')
});

app.get('/api/transactions', async (req, res) => {
    await mongoose.connect(process.env.MONGODB_URL)
    const db = mongoose.connection

    db.on('error', console.error.bind(console, 'MongoDB connection error'))
    db.once('open', () => {
        console.log('Connected to MongoDB Atlas')
    })

    const transactions = await Transaction.find()
    res.json(transactions)
})

app.post('/api/transaction', async (req, res) => {
    await mongoose.connect(process.env.MONGODB_URL)
    const db = mongoose.connection

    db.on('error', console.error.bind(console, 'MongoDB connection error'))
    db.once('open', () => {
        console.log('Connected to MongoDB Atlas')
    })

    const {name, description, datetime, price} = req.body
    const result = await Transaction.create({name, description, datetime, price})
    console.log(result)
    res.json(result)
})

app.listen(port, () => {
    console.log(`API app listening on port ${port}`)
})