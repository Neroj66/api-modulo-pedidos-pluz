const credenciales = require('../models/db').default;
const mysql = require("mysql");

  // Nueva función para actualizar el estado de un pedido
  module.exports.Aprobar = (req, res) => {
    const id = req.body.id;
    const aprobador_id = req.body.aprobador_id;
    const fecha = new Date();
    const estado = req.body.estado;
    const send_aprob = req.body.send_aprobacion;
    const send_val= req.body.send_validacion;

    console.log('Valores recibidos en req.body:');
    console.log(req.body);

    var connection = mysql.createConnection(credenciales);

    const sqlQuery = 'UPDATE pedidos SET aprobador_id=?, fecha_aprobacion=?, estado_id=?, send_aprobacion=?, send_validacion =? WHERE id=?';
    const queryParams = [aprobador_id, fecha, estado, send_aprob, send_val, id];

    console.log('Valores de queryParams:');
    console.log(queryParams);

    connection.query(sqlQuery, queryParams, (err, result) => {
        if (err) {
            console.log('Error al ejecutar la consulta:', err);
            res.status(500).send(err);
        } else {
            console.log('Consulta ejecutada correctamente. Resultado:', result);
            res.send(result);
        }
    });

    connection.end();
};

  // Nueva función para actualizar el estado de un pedido
  module.exports.Validar = (req, res) => {
    const id = req.body.id;
    const validador_id = req.body.validador_id;
    const fecha = new Date();
    const estado = req.body.estado;
    const send = req.body.send_validacion;

    console.log('Valores recibidos en req.body:');
    console.log(req.body);

    var connection = mysql.createConnection(credenciales);

    const sqlQuery = 'UPDATE pedidos SET validador_id=?, fecha_validacion=?, estado_id=?, send_validacion=? WHERE id=?';
    const queryParams = [validador_id, fecha, estado, send, id];

    console.log('Valores de queryParams:');
    console.log(queryParams);

    connection.query(sqlQuery, queryParams, (err, result) => {
        if (err) {
            console.log('Error al ejecutar la consulta:', err);
            res.status(500).send(err);
        } else {
            console.log('Consulta ejecutada correctamente. Resultado:', result);
            res.send(result);
        }
    });

    connection.end();
};

