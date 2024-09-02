const express = require('express');
const router = express.Router();
const { ping } = require('../controllers/pingController');
const { login,obtenerUser } = require('../controllers/loginController');
const { create } = require('../controllers/creacion-pedido');
const { update, delete_ped, send_generacion } = require('../controllers/update-delete-pedido');
const { pedidos, pedidos_detalle, pedidos_detalle_id, pedidosBySector, pedidosByLiquidador, pedidosByUser } = require('../controllers/obtención-pedidos');
const {  consolidador_pedidos, consolidador_logistica, consolidador_detalle } = require('../controllers/Consolidador');
const { Aprobar, Validar } = require('../controllers/aprobar_validar');
const { contratistas, sectores, servicios, materiales, sectorByContratista, serviciosBySector, pdiByContratista } = require('../controllers/otras_operaciones');

router.get('/ping', ping);

router.post('/login', login);

router.get('/obtenerUser/:user', obtenerUser);

router.post('/create', create);

router.put('/update', update);

router.put('/send_generacion', send_generacion); 

router.put('/aprobar', Aprobar); // Nuevo endpoint para actualizar el estado del pedido

router.put('/validar', Validar); // Nuevo endpoint para actualizar el estado del pedido

router.delete('/delete/:id', delete_ped);

router.get('/pedidos', pedidos);

router.get('/pedidos_detalle', pedidos_detalle);

router.get('/pedidos_detalle/:pedido_id', pedidos_detalle_id);

router.get('/consolidador/detalle', consolidador_detalle);

router.get('/consolidador/pedidos', consolidador_pedidos);

router.get('/consolidador/logistica', consolidador_logistica);

router.get('/pedidos/sector/:sector_id',pedidosBySector);

router.get('/pedidos/liquidador/:liquidador_id', pedidosByLiquidador);

router.get('/pedidos/user/:user_id', pedidosByUser);

router.get('/contratistas', contratistas);

router.get('/sectores', sectores);

router.get('/servicios', servicios);

router.get('/materiales', materiales);

router.get('/sectores/contratista/:contratista_id', sectorByContratista);

router.get('/servicios/sector/:sector_id', serviciosBySector);

router.get('/pdi/contratista/:contratista_id', pdiByContratista);

module.exports = router;
