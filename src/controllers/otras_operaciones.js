

const credenciales = require('../models/db');
const mysql = require("mysql");

module.exports.contratistas = (req, res) =>{

    var connection = mysql.createConnection(credenciales);
    connection.query('SELECT * FROM contratista',
    (err,result)=>{
        if(err){
            console.log(err);
        }else{
            res.send(result);
        }
    }
    );
    connection.end()

}
// Endpoint para obtener contratistas por sector
module.exports.sectorByContratista = (req, res) => {
    const { contratista_id } = req.params;
  
    if (!contratista_id) {
      return res.status(400).send('Contratista ID is required');
    }
  
    var connection = mysql.createConnection(credenciales);
  
    connection.query(
      `SELECT *
       FROM sector
       WHERE 
            sector.id IN (
                SELECT sector_id
                FROM contratista_sector
                WHERE contratista_id = ?
            )`,
      [contratista_id],
      (err, results) => {
        if (err) {
          console.log(err);
          return res.status(500).send(err);
        }
        res.status(200).send(results);
      }
    );
  
    connection.end();
  };
module.exports.sectores = (req, res) =>{
    
    var connection = mysql.createConnection(credenciales);
    connection.query('SELECT * FROM sector',
    (err,result)=>{
        if(err){
            console.log(err);
        }else{
            res.send(result);
        }
    }
    );
    connection.end()

}
module.exports.materiales = (req, res) =>{
    
    var connection = mysql.createConnection(credenciales);
    connection.query('SELECT * FROM material WHERE estado =1 ',
    (err,result)=>{
        if(err){
            console.log(err);
        }else{
            res.send(result);
        }
    }
    );
    connection.end()

}


module.exports.servicios = (req, res) =>{
    
    var connection = mysql.createConnection(credenciales);
    connection.query('SELECT * FROM servicios',
    (err,result)=>{
        if(err){
            console.log(err);
        }else{
            res.send(result);
        }
    }
    );
    connection.end()

}
// Endpoint para obtener contratistas por sector
module.exports.serviciosBySector = (req, res) => {
    const { sector_id } = req.params;
  
    if (!sector_id) {
      return res.status(400).send('Sector ID is required');
    }
  
    var connection = mysql.createConnection(credenciales);
  
    connection.query(
      'SELECT * FROM servicios WHERE sector_id = ?',
      [sector_id],
      (err, results) => {
        if (err) {
          console.log(err);
          return res.status(500).send(err);
        }
        res.status(200).send(results);
      }
    );
  
    connection.end();
  };
// Endpoint para obtener contratistas por sector
module.exports.pdiByContratista = (req, res) => {
    const { contratista_id } = req.params;
  
    if (!contratista_id) {
      return res.status(400).send('Sector ID is required');
    }
  
    var connection = mysql.createConnection(credenciales);
  
    connection.query(
      'SELECT * FROM pdi WHERE contratista_id = ?',
      [contratista_id],
      (err, results) => {
        if (err) {
          console.log(err);
          return res.status(500).send(err);
        }
        res.status(200).send(results);
      }
    );
  
    connection.end();
  };
