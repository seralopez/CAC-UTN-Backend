const dotenv = require('dotenv').config();
const { Sequelize, QueryTypes } = require('sequelize')
const express = require('express')
const app = express()

const sequelize = new Sequelize(process.env.DB, process.env.DB_USER, process.env.DB_PASS, {
    host: process.env.DB_HOST,
    dialect: process.env.DB_DIALECT
});

/* const main = async () => {
    try {
        await sequelize.authenticate()
        const notes = await sequelize.query("SELECT * FROM TOU11",
            { type: QueryTypes.SELECT })
        console.log(notes)
        sequelize.close()
    } catch (error) {
        console.error('Unable to connect to the database:', error)
    }
} */

app.get('/api/notes', async (req, res) => {
    const notes = await sequelize.query("SELECT * FROM TOU11",
        { type: QueryTypes.SELECT })
    res.json(notes)
})

const PORT = process.env.DB_PORT
app.listen(PORT, () => { console.log(`Server running on port ${PORT}`) })
