const dotenv = require('dotenv').config();
const { Sequelize, Model, DataTypes, QueryTypes } = require('sequelize')
const express = require('express')
const app = express()
const { body, validationResult } = require('express-validator');
const haversine = require('haversine-distance')
app.use(express.json());
var cors = require('cors')
app.use(cors())
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
    res.status(404).send({ msg: err });
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
    const [resul, meta] = await sequelize.query(`INSERT INTO ${tabla_nombre} ${columna_nombre} VALUES ${valor}`,
        { type: QueryTypes.INSERT })
    return resul
}

// ==================================== SQL LIKE ================================================
async function sql_like(tabla_nombre, columna_nombre, valor) {
    const resultado = await sequelize.query(`SELECT * FROM ${tabla_nombre} where ${columna_nombre} LIKE ${valor};`,
        { type: QueryTypes.SELECT })
    if (resultado.length == 0) {
        return false
    } else {
        return resultado
    }
}
// ==================================== SQL SELECT ================================================
async function sql_select(columna_dato, tabla_nombre, columna_nombre, valor) {
    const resultado = await sequelize.query(`SELECT ${columna_dato} FROM ${tabla_nombre} where ${columna_nombre} = ${valor};`,
        { type: QueryTypes.SELECT })
    if (resultado.length == 0) {
        return false
    } else {
        return resultado//false
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
// ==================================== PERFIL ID =================================================
app.get("/perfil/:valor", perfil_id, badRequest)
async function perfil_id(req, res, next) {
    valor = req.params.valor
    tabla_nombre = `tbl_usuarios JOIN tbl_servicios on tbl_servicios.servicios_usuario = tbl_usuarios.usuario_id`
    tabla_nombre += ' JOIN tbl_datos on tbl_datos.datos_id = tbl_usuarios.usuario_id'
    const check = sql_result(tabla_nombre, 'usuario_id', `${valor}`)
    check.then(val => {
        if (val) {
            delete val[0]['usuario_pass']
            let date = new Date(val[0]['usuario_ultConec']);
            val[0]['usuario_ultConec'] = date.toISOString().replace(/T/, ' ').replace(/\..+/, '');
            res.json(val)
        } else {
            next(`Usuario no existe.`)
        }
    })
}
// ==================================== PRESTADOR * ===============================================
app.get("/prestadores/:dato/:valor", prestadores_ver, badRequest)
async function prestadores_ver(req, res, next) {
    valor = `'${req.params.valor}'`
    dato = req.params.dato
    tabla_nombre = `tbl_usuarios JOIN tbl_servicios on tbl_servicios.servicios_usuario = tbl_usuarios.usuario_id`
    tabla_nombre += ' JOIN tbl_datos on tbl_datos.datos_id = tbl_usuarios.usuario_id'
    switch (dato) {
        case "buscador":
            columna_nombre = `tbl_servicios.servicios_nombre`
            break;
        case "horario":
            columna_nombre = `tbl_datos.datos_disponibilidad`
            break;
        case "calificacion":
            valor = req.params.valor
            columna_nombre = `tbl_datos.datos_calificacion`
            break;
        case "prestador":
            columna_nombre = `tbl_servicios.servicios_nombre`
            break;
    }

    let check
    if (dato != "buscador") {
        valor += ` ORDER BY datos_calificacion DESC`
        check = sql_result(tabla_nombre, columna_nombre, valor)
    } else {
        valor = `'${req.params.valor}%'`
        check = sql_like(tabla_nombre, columna_nombre, valor)
    }

    check.then(val => {

        if (val) {
            const a = { latitude: -34.70207407721391, longitude: -58.371419282884325 }
            let datos = []
            val.forEach(element => {
                delete element['usuario_pass']
                const gps = element.datos_gps.split(',')
                const b = { latitude: gps[0], longitude: gps[1] }
                const distancia = ((haversine(a, b)) / 1000).toString().slice(0, 4)
                element.datos_gps = distancia
            });
            res.json(val)
        } else {
            next(`No hay servicios que coincidan con tu búsqueda`)
        }
    })
}
// ==================================== TOKEN =====================================================
app.get("/api/:valor", api_token, badRequest)
async function api_token(req, res, next) {
    valor = req.params.valor
    tabla_nombre = `tbl_usuarios JOIN tbl_servicios on tbl_servicios.servicios_usuario = tbl_usuarios.usuario_id`
    tabla_nombre += ' JOIN tbl_datos on tbl_datos.datos_id = tbl_usuarios.usuario_id'
    const check = sql_result(tabla_nombre, 'usuario_token', `'${valor}'`)
    check.then(val => {
        if (val) {
            delete val[0]['usuario_pass']
            res.json(val)
        } else {
            next(`Usuario no existe.`)
        }
    })
}
// ==================================== TRABAJO INSERT ============================================
app.post("/trabajo/nuevo", trabajo_insert, badRequest)
async function trabajo_insert(req, res, next) {
    tablas = (`trabajo_prestador`, `trabajo_usuario`, `trabajo_descripcion`, `trabajo_horario`, `trabajo_estado`, `trabajo_comentario`, `trabajo_medio`)
    valores = (req.body.prestador, req.body.usuario, req.body.desc, req.body.horario, 'Consulta', req.body.comentario, req.body.medio)
    const sql_insert_resultado = sql_insert(`tbl_trabajos`, tablas, valores)
    sql_insert_resultado.then(valor => {
        res.json({ msg: `Solicitud enviada!` })
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
// ==================================== TOKEN CHECK =========================================++++++
app.post("/login", login, badRequest)
async function login(req, res, next) {
    usr_email = req.body.email
    usr_password = req.body.password
    valor = `'${usr_email}' AND usuario_pass = '${usr_password}'`
    const check = sql_select('usuario_token,usuario_nombre', 'tbl_usuarios', 'usuario_correo', valor)
    check.then(val => {
        if (val) {
            res.json(val[0])
        } else {
            next(`Ingresaste un e‑mail o contraseña incorrectos.`)
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
