
const credenciales = require('../models/db');
const mysql = require("mysql");

const getCurrentMaterials = (pedidoId, connection) => {
    return new Promise((resolve, reject) => {
        const query = 'SELECT material_id, cantidad, importe FROM pedidos_detalle WHERE pedidos_id = ?';
        connection.query(query, [pedidoId], (err, results) => {
            if (err) return reject(err);
            resolve(results);
        });
    });
};

const haveMaterialsChanged = (currentMaterials, newMaterials) => {
    const currentMaterialMap = new Map(currentMaterials.map(m => [m.material_id, m]));
    const newMaterialMap = new Map(newMaterials.map(m => [m.id, { cantidad: m.quantity, importe: m.importe }]));

    const addedMaterials = [];
    const removedMaterials = [];
    const updatedMaterials = [];

    // Verificar materiales eliminados o modificados
    for (const [id, material] of currentMaterialMap) {
        if (!newMaterialMap.has(id)) {
            removedMaterials.push(id);
        } else {
            const newMaterial = newMaterialMap.get(id);
            if (parseFloat(material.cantidad) !== parseFloat(newMaterial.cantidad) ||
                parseFloat(material.importe) !== parseFloat(newMaterial.importe)) {
                updatedMaterials.push({ ...newMaterial, id });
            }
        }
    }

    // Verificar materiales añadidos
    for (const [id, newMaterial] of newMaterialMap) {
        if (!currentMaterialMap.has(id)) {
            addedMaterials.push({ ...newMaterial, id }); // Asegúrate de que el id se incluya
        }
    }

    console.log('Materiales añadidos:', addedMaterials); // Imprime los materiales añadidos

    return { addedMaterials, removedMaterials, updatedMaterials };
};


module.exports.update = (req, res) => {
    const id = req.body.id;
    const sector = req.body.sector;
    const pdi = req.body.pdi;
    const servicio = req.body.servicio;
    const lcl = req.body.lcl;
    const materiales = req.body.materiales; // Array de materiales
    const newtotal = parseFloat(req.body.newtotal); // Asegúrate de que sea un número

    if (!Array.isArray(materiales)) {
        console.error('Materiales recibidos no son un array:', materiales);
        return res.status(400).send('Invalid data format');
    }
    
    // Verificación de cada material
    materiales.forEach((material, index) => {
        if (material.id == null) {
            console.error(`Material en índice ${index} no tiene id:`, material);
            return res.status(400).send(`Material at index ${index} is missing an id`);
        }
    });

    var connection = mysql.createConnection(credenciales);

    // Primero, actualiza el pedido
    const sqlUpdateQuery = `
        UPDATE pedidos 
        SET 
            sector_id = IF(? IS NOT NULL, ?, sector_id),  
            pdi_id = IF(? IS NOT NULL, ?, pdi_id),  
            servicio_id = IF(? IS NOT NULL, ?, servicio_id), 
            LCL_ING = IF(? IS NOT NULL, ?, LCL_ING),
            total = ?
        WHERE id = ?
    `;
    const updateParams = [sector, sector, pdi, pdi, servicio, servicio, lcl, lcl, newtotal, id];

    connection.query(sqlUpdateQuery, updateParams, (err, result) => {
        if (err) {
            console.log(err);
            connection.end();
            return res.status(500).send(err);
        }

        getCurrentMaterials(id, connection)
            .then(currentMaterials => {
                const { addedMaterials, removedMaterials, updatedMaterials } = haveMaterialsChanged(currentMaterials, materiales);

                const queries = [];

                // Manejar materiales eliminados
                if (removedMaterials.length > 0) {
                    const deleteQuery = 'DELETE FROM pedidos_detalle WHERE pedidos_id = ? AND material_id IN (?)';
                    queries.push(new Promise((resolve, reject) => {
                        connection.query(deleteQuery, [id, removedMaterials], (err) => {
                            if (err) return reject(err);
                            resolve();
                        });
                    }));
                }

                // Manejar materiales añadidos
                if (addedMaterials.length > 0) {
                    addedMaterials.forEach(material => {
                        if (material.id != null) {
                            const insertQuery = 'INSERT INTO pedidos_detalle (pedidos_id, material_id, cantidad, importe) VALUES (?, ?, ?, ?)';
                            queries.push(new Promise((resolve, reject) => {
                                connection.query(insertQuery, [id, material.id, material.cantidad, material.importe], (err) => {
                                    if (err) return reject(err);
                                    resolve();
                                });
                            }));
                        } else {
                            console.error('Material id is null or undefined:', material);
                        }
                    });
                }

                // Manejar materiales actualizados
                if (updatedMaterials.length > 0) {
                    updatedMaterials.forEach(material => {
                        const updateMaterialQuery = 'UPDATE pedidos_detalle SET cantidad = ?, importe = ? WHERE pedidos_id = ? AND material_id = ?';
                        queries.push(new Promise((resolve, reject) => {
                            connection.query(updateMaterialQuery, [material.cantidad, material.importe, id, material.id], (err) => {
                                if (err) return reject(err);
                                resolve();
                            });
                        }));
                    });
                }

                Promise.all(queries)
                    .then(() => {
                        connection.end();
                        res.send('Pedido actualizado con éxito.');
                    })
                    .catch(error => {
                        console.log(error);
                        connection.end();
                        res.status(500).send(error);
                    });
            })
            .catch(err => {
                console.log(err);
                connection.end();
                res.status(500).send(err);
            });
    });
};

module.exports.delete_ped = (req, res) => {
    const id = req.params.id;
    var connection = mysql.createConnection(credenciales);
    
    connection.beginTransaction(err => {
        if (err) {
            console.log(err);
            return res.status(500).send(err);
        }
        
        // Eliminar los registros en pedidos_detalle correspondientes al pedido eliminado
        const deleteDetalleQuery = 'DELETE FROM pedidos_detalle WHERE pedidos_id = ?';
        connection.query(deleteDetalleQuery, id, (err, result) => {
            if (err) {
                return connection.rollback(() => {
                    console.log(err);
                    res.status(500).send(err);
                });
            }

            // Luego de eliminar los detalles, eliminar el pedido
            const deletePedidoQuery = 'DELETE FROM pedidos WHERE id = ?';
            connection.query(deletePedidoQuery, id, (err, result) => {
                if (err) {
                    return connection.rollback(() => {
                        console.log(err);
                        res.status(500).send(err);
                    });
                }

                // Commit si no hay errores
                connection.commit(err => {
                    if (err) {
                        return connection.rollback(() => {
                            console.log(err);
                            res.status(500).send(err);
                        });
                    }
                    
                    console.log(`Pedido con ID ${id} eliminado correctamente junto con sus detalles`);
                    res.send(result);
                    connection.end(); // Aquí se cierra la conexión después de completar la transacción
                });
            });
        });
    });
};


module.exports.send_generacion = (req, res) => {
    const id = req.body.id;
    console.log('Valores recibidos en req.body:');
    console.log(req.body);

    var connection = mysql.createConnection(credenciales);

    const sqlQuery = 'UPDATE pedidos SET send_generacion = 1 WHERE id=?';
    const queryParams = [id];

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

