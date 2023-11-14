const dotenv = require('dotenv').config();
const { Sequelize, QueryTypes } = require('sequelize')
const express = require('express')
const app = express()
const { body, validationResult } = require('express-validator');
app.use(express.json());

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

function badRequest(err, req, res, next) {
    res.status(404)
    res.json({ message: err })
    return new Error(err)
}
// ==================================== ROL AGREGAR ===============================================
app.post("/rol/agregar", rol_agregar, badRequest)
async function rol_agregar(req, res, next) {
    nombre = req.body.nombre
    const check = sql_select(`rol_nombre`, `tbl_rol`, `rol_nombre`, `${nombre}`)
    check.then(val => {
        if (val) {
            res.json({ msg: `Rol no ` })
        } else {
            next(`Rol ${nombre} ya existe.`)
        }
    })
    /* const nombre = sequelize.query(`INSERT INTO tbl_rol SET rol_nombre = ${nombre}`,
        { type: QueryTypes.SELECT }) 
    res.json({ msg: check }) */
}
// ==================================== SQL SELECT ================================================
async function sql_select(columna_dato, tabla_nombre, columna_nombre, valor) {
    const resultado = await sequelize.query(`SELECT ${columna_dato} FROM ${tabla_nombre} where ${columna_nombre} = "${valor}";`,
        { type: QueryTypes.SELECT })
    if (resultado.length <= 0) {
        return true
    } else {
        return false
    }
}

const PORT = process.env.DB_PORT
app.listen(PORT, () => { console.log(`<  < - Servidor iniciado en ${PORT} - >  >`) })