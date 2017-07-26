'use strict';
const db = require("../db/connection");

//SUPORT

function getFields(tipo) {
    switch (tipo) {
        case "EV":
            return `
                m.modelo,
                m.ancho_bobina,
                m.largo_bolsa,
                m.ancho_bolsa,
                m.velocidad,
                m.voltaje,
                m.volumen_llenado,
                m.peso,
                m.consumo_aire,
                m.presion_aire,
                m.potencia_kw,
                m.dimensiones,
                m.tipo,
                m.stock,
                d.desc,
                d.link
            `
            break;
        case "EH":
            return `
                m.modelo,
                m.velocidad,
                m.ancho_bobina,
                m.largo_bolsa,
                m.ancho_bolsa,
                m.altura_paquete,
                m.voltaje,
                m.potencia_kw,
                m.dimensiones,
                m.peso,
                m.tipo,
                m.stock,
                d.desc,
                d.link
            `
        case "ED":
            return `
            m.modelo,
            m.numero_estaciones,
            m.estaciones_dosificados,
            m.zipper,
            m.peso_max_bolsa,
            m.ancho_bolsa,
            m.largo_bolsa,
            m.velocidad,
            m.voltaje,
            m.potencia_kw,
            m.consumo_aire,
            m.dimensiones,
            m.peso,
            m.stock,
            d.desc,
            d.link
            `;
        case "BM":
            return `
            m.modelo,
            m.modulos_pesaje,
            m.volumen_tolva,
            m.velocidad,
            m.peso,
            m.exactitud,
            m.velocidad,
            m.potencia_kw,
            m.dimensiones,
            m.peso,
            m.stock,
            d.desc,
            d.link
            `;
        case "BL":
            return `
            m.modelo,
            m.volumen_tolva,
            m.modulos_pesaje,
            m.peso_max_tolva,
            m.peso_max_combinacion,
            m.velocidad,
            m.exactitud,
            m.voltaje,
            m.potencia_kw,
            m.dimensiones,
            m.peso,
            m.stock,
            d.desc,
            d.link
            `;
        case "DT":
            return `
            m.modelo,
            m.diametro_tornillo,
            m.peso,
            m.velocidad,
            m.exactitud,
            m.voltaje,
            m.potencia_kw,
            m.peso,
            m.volumen_tolva,
            m.stock,
            d.desc,
            d.link
            `;
        case "DTZ":
            return `
            m.modelo,
            m.capacidad,
            m.volumen_llenado,
            m.velocidad,
            m.dimensiones,
            m.stock,
            d.desc,
            d.link
            `;

        default:
            return `
            *
            `;
    }
}

function getMaquinas(tipo, callback) {
    db.getConnection(function (errc, con) {
        var response_data = {}
        if (errc) {
            callback(errc);
            return;
        }
        con.query(`
            SELECT rm.nombre_tabla ,
            m.* 
            from pachuco65_web.relacion_maquina rm 
            join pachuco65_web.maquina m on m.idtipo_maquina = rm.id_tipo
            where rm.id_tipo = ${tipo}
        `,
            function (err, rows, fields) {
                if (err) {
                    callback(err);
                    return;
                }
                if (rows.length < 0) {
                    callback(null, null);
                    return;
                }
                response_data.detalle = rows[0];
                con.query(`
                    select * from ${rows[0].nombre_tabla}
                `,
                    function (err, rows, fields) {
                        if (err) {
                            console.log(err);
                            callback(err);
                            return;
                        }
                        con.release();
                        if (rows.length < 0) {
                            callback(null, null);
                            return;
                        }
                        response_data.maquinas = rows;
                        callback(null, response_data);
                    });
            });
    });
}

module.exports = {
    getMaquinas
}