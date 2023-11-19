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
// ==================================== DATOS AGREGAR =============================================
app.post("/datos/agregar", datos_agregar, badRequest)
async function datos_agregar(req, res, next) {
    usr_id = req.body.id
    telefono = req.body.telefono
    pais = req.body.pais
    provincia = req.body.provincia
    localidad = req.body.localidad
    calle = req.body.calle
    disponibilidad = req.body.disponibilidad
    servicios = req.body.servicios
    tabla_nombre = 'tbl_datos'

    const check = sql_select(`usuario_id`, `tbl_usuarios`, `usuario_id`, usr_id)
    check.then(val => {
        if (!val) {
            columna_nombre = 'datos_telefono,datos_pais,datos_provincia,datos_localidad,datos_calle,datos_disponibilidad,datos_servicios'
            datos_sql = `${telefono}, ${pais}, ${provincia}, ${localidad}, '${calle}', '${disponibilidad}', ${servicios}`
            const sql_insert_resultado = sql_insert(tabla_nombre, columna_nombre, datos_sql)
            sql_insert_resultado.then(valor => {
                res.json({ msg: `Datos guardados con el ID : ${valor}` })
            })
        } else {
            next(`Usuario ${nombre} no existe.`)
        }
    })
}
// ==================================== DATOS MODIFICAR ===========================================
app.post("/datos/modificar", datos_modificar, badRequest)
async function datos_modificar(req, res, next) {
    usr_id = req.body.id
    telefono = req.body.telefono
    pais = req.body.pais
    provincia = req.body.provincia
    localidad = req.body.localidad
    calle = req.body.calle
    gps = req.body.gps
    disponibilidad = req.body.disponibilidad
    servicios = req.body.servicios
    tabla_nombre = 'tbl_datos'

    const check = sql_select(`usuario_id`, `tbl_usuarios`, `usuario_id`, usr_id)
    check.then(val => {
        if (!val) {
            const resultado = sql_result(`tbl_usuarios`, `usuario_id`, usr_id)
            resultado.then(val => {
                columna_nombre = `SET datos_telefono = ${telefono}, datos_pais = ${pais},`
                columna_nombre += `datos_provincia = ${provincia}, datos_localidad = ${localidad},`
                columna_nombre += `datos_calle = '${calle}' , datos_gps = '${gps}',`
                columna_nombre += `datos_disponibilidad = '${disponibilidad}' , datos_servicios = ${servicios}`
                sql_where = `datos_id = ${val[0]['usuario_datos']}`
                const sql_insert_resultado = sql_update(tabla_nombre, columna_nombre, sql_where)
                sql_insert_resultado.then(valor => {
                    res.json({ msg: `Datos modificados correctamente.` })
                })
            })
        } else {
            next(`Usuario ${usr_id} no existe.`)
        }
    })
}
// ==================================== GEO AGREGAR ===============================================
app.post("/geo/agregar", geo_agregar, badRequest)
async function geo_agregar(req, res, next) {
    pais = req.body.pais
    provincia = req.body.provincia
    localidad = req.body.localidad
    nombre = req.body.nombre
    tabla_nombre = 'tbl_geografia'

    columna_nombre = 'geo_pais_id,geo_provincia_id,geo_ciudad_id,geo_nombre'
    datos_sql = `${pais}, ${provincia}, ${localidad}, '${nombre}'`
    const sql_insert_resultado = sql_insert(tabla_nombre, columna_nombre, datos_sql)
    sql_insert_resultado.then(valor => {
        res.json({ msg: `Datos geo guardados con el ID : ${valor}` })
    })
}
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
    const check = sql_select(`rol_nombre`, `tbl_rol`, `rol_nombre`, `'${nombre}'`)
    check.then(val => {
        if (val) {
            const sql_insert_resultado = sql_insert(`tbl_rol`, `rol_nombre`, `'${nombre}'`)
            sql_insert_resultado.then(valor => {
                res.json({ msg: `Rol guardado con el ID : ${valor}` })
            })
        } else {
            next(`Rol ${nombre} ya existe.`)
        }
    })
}
// ==================================== SERVICIO AGREGAR ==========================================
app.post("/servicio/agregar", servicio_agregar, badRequest)
async function servicio_agregar(req, res, next) {
    nombre = req.body.nombre
    tabla_nombre = 'tbl_servicios'
    columna_nombre = `servicios_nombre`
    const check = sql_select(columna_nombre, tabla_nombre, columna_nombre, `'${nombre}'`)
    check.then(val => {
        if (val) {
            const sql_insert_resultado = sql_insert(tabla_nombre, columna_nombre, `'${nombre}'`)
            sql_insert_resultado.then(valor => {
                res.json({ msg: `Servicio guardado con el ID : ${valor}` })
            })
        } else {
            next(`Servicio ${nombre} ya existe.`)
        }
    })
}
// ==================================== SQL INSERT ================================================
async function sql_insert(tabla_nombre, columna_nombre, valor) {
    const [resul, meta] = await sequelize.query(`INSERT INTO ${tabla_nombre} (${columna_nombre}) VALUES (${valor})`,
        { type: QueryTypes.INSERT })
    return resul
}
// ==================================== SQL SELECT ================================================
async function sql_select(columna_dato, tabla_nombre, columna_nombre, valor) {
    const resultado = await sequelize.query(`SELECT ${columna_dato} FROM ${tabla_nombre} where ${columna_nombre} = ${valor};`,
        { type: QueryTypes.SELECT })
    if (resultado.length == 0) {
        return true
    } else {
        return false
    }
}
// ==================================== SQL SELECT * ================================================
async function sql_result(tabla_nombre, columna_nombre, valor) {
    const resultado = await sequelize.query(`SELECT * FROM ${tabla_nombre} where ${columna_nombre} = ${valor};`,
        { type: QueryTypes.SELECT })
    if (resultado.length == 0) {
        return false
    } else {
        return resultado
    }
}
// ==================================== SQL UPDATE ================================================
async function sql_update(tabla_nombre, columna_nombre, valor) {
    const [resul, meta] = await sequelize.query(`UPDATE ${tabla_nombre} ${columna_nombre} WHERE ${valor}`,
        { type: QueryTypes.UPDATE })
    return resul
}
// ==================================== PRESTADOR * ===========================================++++
app.post("/prestadores/", prestadores_ver, badRequest)
async function prestadores_ver(req, res, next) {
    rol = req.body.rol
    tabla_nombre = `tbl_usuarios JOIN tbl_servicios on tbl_servicios.servicios_usuario = tbl_usuarios.usuario_id`
    columna_nombre = `tbl_servicios.servicios_nombre`
    const check = sql_result(tabla_nombre, columna_nombre, `"${rol}"`)
    //const resultado = await sequelize.query(`SELECT * from  WHERE tbl_servicios.servicios_nombre = "${rol}";`,
    //  { type: QueryTypes.SELECT })
    check.then(val => {
        if (val) {
            /*columna_nombre = 'usuario_nombre,usuario_apellido,usuario_pass,usuario_correo,usuario_datos,usuario_rol'
            datos_sql = `'${nombre}', '${apellido}', '${pass}', '${correo}', ${datos_usr}, ${rol}`
            const sql_insert_resultado = sql_insert('tbl_usuarios', columna_nombre, datos_sql)
            sql_insert_resultado.then(valor => {
                res.json({ msg: `Usuario guardado con el ID : ${valor}` })
            }) */
            res.json({ msg: val })
        } else {
            next(`No se encontro prestador.`)
        }
    })
}
// ==================================== USUARIO AGREGAR ===========================================
app.post("/usuario/agregar", usuario_agregar, badRequest)
async function usuario_agregar(req, res, next) {
    nombre = req.body.nombre
    apellido = req.body.apellido
    pass = req.body.pass
    correo = req.body.correo
    datos_usr = req.body.datos
    rol = req.body.rol

    const check = sql_select(`usuario_correo`, `tbl_usuarios`, `usuario_correo`, `'${correo}'`)
    check.then(val => {
        if (val) {
            columna_nombre = 'usuario_nombre,usuario_apellido,usuario_pass,usuario_correo,usuario_datos,usuario_rol'
            datos_sql = `'${nombre}', '${apellido}', '${pass}', '${correo}', ${datos_usr}, ${rol}`
            const sql_insert_resultado = sql_insert('tbl_usuarios', columna_nombre, datos_sql)
            sql_insert_resultado.then(valor => {
                res.json({ msg: `Usuario guardado con el ID : ${valor}` })
            })
        } else {
            next(`Usuario ${correo} ya registrado.`)
        }
    })
}
// ==================================== USUARIO MODIFICAR =========================================
app.post("/usuario/modificar", usuario_modificar, badRequest)
async function usuario_modificar(req, res, next) {
    usr_id = req.body.id
    nombre = req.body.nombre
    apellido = req.body.apellido
    pass = req.body.pass
    correo = req.body.correo
    rol = req.body.rol

    const check = sql_select(`usuario_id`, `tbl_usuarios`, `usuario_id`, usr_id)
    check.then(val => {
        if (!val) {
            columna_nombre = `SET usuario_nombre = '${nombre}', usuario_apellido = '${apellido}',`
            columna_nombre += `usuario_pass = '${pass}', usuario_correo = '${correo}',`
            columna_nombre += ` usuario_rol = ${rol} `
            sql_where = `usuario_id = ${usr_id}`
            const sql_insert_resultado = sql_update('tbl_usuarios', columna_nombre, sql_where)
            sql_insert_resultado.then(valor => {
                res.json({ msg: `Usuario modificado correctamente.` })
            })
        } else {
            next(`Usuario ${correo} no existe.`)
        }
    })
}
// ==================================== INICIO SERVIDOR ===========================================
const PORT = process.env.DB_PORT
app.listen(PORT, () => { console.log(`<  < - Servidor iniciado en ${PORT} - >  >`) })
