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
            const sql_insert_resultado = sql_select(`rol_nombre`, `tbl_rol`, `rol_nombre`, `${nombre}`)
            res.json({ msg: sql_insert_resultado })
        } else {
            next(`Rol ${nombre} ya existe.`)
        }
    })
}

// ==================================== SQL INSERT ================================================
async function sql_insert(columna_dato, tabla_nombre, columna_nombre, valor) {
    /*const resultado = await sequelize.query(`INSERT INTO ${columna_dato} FROM ${tabla_nombre} where ${columna_nombre} = "${valor}";`,
        { type: QueryTypes.SELECT })
    if (resultado.length <= 0) {
        return true
    } else {
        return false
    }
    */

    const Rol = sequelize.define('Rol', {
        RolNombre: {
            type: DataTypes.STRING,
        }
    });

    (async () => {
        await sequelize.sync();
        const [results, metadata] = await sequelize.query(`INSERT INTO ${tabla_nombre} (${columna_nombre}) VALUES ('${valor}')`);
        console.log(results);
        return results
    })();
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

// ==================================== USUARIO AGREGAR ===========================================
app.post("/usuario/agregar", rol_agregar, badRequest)
async function rol_agregar(req, res, next) {
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