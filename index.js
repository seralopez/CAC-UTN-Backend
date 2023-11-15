const dotenv = require('dotenv').config();
const { Sequelize, Model, DataTypes, QueryTypes } = require('sequelize')
const express = require('express')
const app = express()
const { body, validationResult } = require('express-validator');
app.use(express.json());
// ==================================== VARIABLES ENTORNO =========================================
const sequelize = new Sequelize(process.env.DB, process.env.DB_USER, process.env.DB_PASS, {
    host: process.env.DB_HOST,
    dialect: process.env.DB_DIALECT
});
// ==================================== REQUEST ERROR =============================================
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
            const sql_insert_resultado = sql_insert(`rol_nombre`, `tbl_rol`, `rol_nombre`, `${nombre}`)
            sql_insert_resultado.then(valor => {
                res.json({ msg: `Rol guardado con el ID : ${valor}` })
            })
        } else {
            next(`Rol ${nombre} ya existe.`)
        }
    })
}
// ==================================== SQL INSERT ================================================
async function sql_insert(columna_dato, tabla_nombre, columna_nombre, valor) {
    const [resul, meta] = await sequelize.query(`INSERT INTO ${tabla_nombre} (${columna_nombre}) VALUES ('${valor}')`,
        { type: QueryTypes.INSERT })
    return resul
}
// ==================================== SQL SELECT ================================================
async function sql_select(columna_dato, tabla_nombre, columna_nombre, valor) {
    const resultado = await sequelize.query(`SELECT ${columna_dato} FROM ${tabla_nombre} where ${columna_nombre} = "${valor}";`,
        { type: QueryTypes.SELECT })
    if (resultado.length == 0) {
        return true
    } else {
        return false
    }
}
// ==================================== USUARIO AGREGAR ===========================================
app.post("/usuario/agregar", usuario_agregar, badRequest)
async function usuario_agregar(req, res, next) {
    nombre = req.body.nombre
    const check = sql_select(`rol_nombre`, `tbl_rol`, `rol_nombre`, `${nombre}`)
    check.then(val => {
        if (val) {
            const sql_insert_resultado = sql_select(`rol_nombre`, `tbl_rol`, `rol_nombre`, `${nombre}`)
            res.json({ msg: sql_insert_resultado })
        } else {
            next(`Rol ${nombre} ya existe.`)
        }
    })
}

// ==================================== INICIO SERVIDOR ===========================================
const PORT = process.env.DB_PORT
app.listen(PORT, () => { console.log(`<  < - Servidor iniciado en ${PORT} - >  >`) })