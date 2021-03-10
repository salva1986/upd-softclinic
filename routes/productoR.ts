import { Router } from 'express';
import { verificaToken } from '../middlewares/autenticacion';
import * as productoC from '../controllers/productoC';

const productoRoutes = Router();

productoRoutes.get('/get/:estado/:sort/:order/:page/:texto', [ verificaToken ],  productoC.verTodos);
productoRoutes.get('/get/:estado', [verificaToken], productoC.verProductosActivos);
productoRoutes.put('/registrar/:id', [verificaToken], productoC.registrarProducto);
productoRoutes.put('/delete/:id', [verificaToken], productoC.eliminarProducto);
productoRoutes.put('/deleteselected/:filtro', [verificaToken], productoC.eliminarProductos);
productoRoutes.get('/verproducto/:id', [verificaToken], productoC.verProducto);
productoRoutes.post('/addstock/:factura', [verificaToken], productoC.addStock);
productoRoutes.get('/verStock/:id', [verificaToken], productoC.verStock);
productoRoutes.get('/get/:sort/:order/:page/:id', [verificaToken], productoC.verInfoProducto);
productoRoutes.get('/get/select/productos', [verificaToken], productoC.verSelectProductos); //Especialmente para selects, solo id, nombre y stock de producto
productoRoutes.get('/detalle/producto/:id', [verificaToken], productoC.verDetalleProducto); // Muestra toda la información del producto



export default productoRoutes;