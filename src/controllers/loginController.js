const credenciales = require('../models/db');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const mysql = require("mysql");



module.exports.login = (req, res) =>{
    //usar: https://bcrypt-generator.com/   para generacion de contraseñas hash
    const username = req.body.username;
    const password = req.body.password;
    var connection = mysql.createConnection(credenciales);
    
    const consult = 'SELECT * FROM usuarios WHERE username = ?';
    
    try {
        connection.query(consult, [username], (err, result) => {
            if (err) {
                console.error('Error en la consulta:', err);
                res.status(500).send('Error en la consulta');
                return;
            }
    
            if (result.length > 0) {
                const hashedPassword = result[0].password;
                
                console.log("Contraseña ingresada:", password);
                console.log("Contraseña hasheada:", hashedPassword);
    
                bcrypt.compare(password, hashedPassword, (err, isMatch) => {
                    if (err) {
                        console.error('Error al comparar contraseñas:', err);
                        res.status(500).send('Error al comparar contraseñas');
                        return;
                    }
    
                    if (isMatch) {
                        const token = jwt.sign({ username }, "Stack", {
                            expiresIn: '2h'
                        });
                        console.log(`[${new Date().toLocaleString()}] Loggeo correcto de: ${username}`);
                        res.send({ token });
                    } else {
                        console.log(`[${new Date().toLocaleString()}] Error loggeo de: ${username}`);
                        res.send({ message: 'Usuario y/o contraseña inválida.' });
                    }
                });
            } else {
                console.log(`[${new Date().toLocaleString()}] Usuario no encontrado: ${username}`);
                res.send({ message: 'Usuario no encontrado.' });
            }
        });
    } catch (e) {
        console.error('Error inesperado:', e);
        res.status(500).send('Internal server error');
    } finally {
        connection.end();
    }
    
}

module.exports.obtenerUser = (req, res) => {
    const { user } = req.params;
  
    if (!user) {
      return res.status(400).send('Username is required');
    }

  
    var connection = mysql.createConnection(credenciales);
  
    connection.query(
            `SELECT usuarios.*, 
                generador_contratista.contratista_id AS contratistaId
                FROM usuarios
                LEFT JOIN generador_contratista ON generador_contratista.generador_id = usuarios.id
                WHERE usuarios.username = ?;
                `,
      [user],
      (err, results) => {
        connection.end(); // Cerrar conexión después de la consulta
        console.log('user encontrado:', results); 
        if (err) {
          console.error('Error en la consulta:', err); // Imprimir el error en la consola del servidor
          return res.status(500).send(err);
        }
  
        res.status(200).send(results);
      }
    );
  };
  
  



