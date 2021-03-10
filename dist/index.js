"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const http_1 = __importDefault(require("http"));
const express_1 = __importDefault(require("express"));
const mongoose_1 = __importDefault(require("mongoose"));
const body_parser_1 = __importDefault(require("body-parser"));
const express_fileupload_1 = __importDefault(require("express-fileupload"));
const usuarioR_1 = __importDefault(require("./routes/usuarioR"));
const pacienteR_1 = __importDefault(require("./routes/pacienteR"));
const productoR_1 = __importDefault(require("./routes/productoR"));
const proveedorR_1 = __importDefault(require("./routes/proveedorR"));
const servicioR_1 = __importDefault(require("./routes/servicioR"));
const presentacionR_1 = __importDefault(require("./routes/presentacionR"));
const entradaR_1 = __importDefault(require("./routes/entradaR"));
const postR_1 = __importDefault(require("./routes/postR"));
const rolR_1 = __importDefault(require("./routes/rolR"));
const registroPacienteR_1 = __importDefault(require("./routes/registroPacienteR"));
const pedidoR_1 = __importDefault(require("./routes/pedidoR"));
const facturaR_1 = __importDefault(require("./routes/facturaR"));
const citaR_1 = __importDefault(require("./routes/citaR"));
const farmaciaR_1 = __importDefault(require("./routes/farmaciaR"));
const consumibleR_1 = __importDefault(require("./routes/consumibleR"));
const insumoR_1 = __importDefault(require("./routes/insumoR"));
const ortopodologiaR_1 = __importDefault(require("./routes/ortopodologiaR"));
const cors_1 = __importDefault(require("cors"));
const bodegaR_1 = __importDefault(require("./routes/bodegaR"));
const salidaR_1 = __importDefault(require("./routes/salidaR"));
const casaR_1 = __importDefault(require("./routes/casaR"));
const lineaR_1 = __importDefault(require("./routes/lineaR"));
const ordenR_1 = __importDefault(require("./routes/ordenR"));
const requisicionR_1 = __importDefault(require("./routes/requisicionR"));
const kardexR_1 = __importDefault(require("./routes/kardexR"));
const reporteR_1 = __importDefault(require("./routes/reporteR"));
const app = express_1.default();
// Body parser
app.use(body_parser_1.default.urlencoded({ extended: true }));
app.use(body_parser_1.default.json());
// FileUpload
app.use(express_fileupload_1.default({ useTempFiles: true }));
// //Configurar CORS
app.use(cors_1.default({ origin: true, credentials: true }));
// Rutas
// Admin
app.use('/user', usuarioR_1.default);
app.use('/paciente', pacienteR_1.default);
app.use('/rol', rolR_1.default);
app.use('/producto', productoR_1.default);
app.use('/proveedor', proveedorR_1.default);
app.use('/servicio', servicioR_1.default);
app.use('/presentacion', presentacionR_1.default);
app.use('/registropaciente', registroPacienteR_1.default);
app.use('/casa', casaR_1.default);
app.use('/linea', lineaR_1.default);
// Recepción
app.use('/cita', citaR_1.default);
// Inventario
app.use('/orden', ordenR_1.default);
app.use('/pedido', pedidoR_1.default);
app.use('/bodega', bodegaR_1.default);
app.use('/salida', salidaR_1.default);
app.use('/farmacia', farmaciaR_1.default);
app.use('/consumible', consumibleR_1.default);
app.use('/insumo', insumoR_1.default);
app.use('/ortopodologia', ortopodologiaR_1.default);
app.use('/posts', postR_1.default);
app.use('/entrada', entradaR_1.default);
app.use('/factura', facturaR_1.default);
app.use('/requisicion', requisicionR_1.default);
app.use('/kardex', kardexR_1.default);
app.use('/reporte', reporteR_1.default);
// // Conectar DB
mongoose_1.default.connect('mongodb://localhost:27017/upd-softclinicdb', { useNewUrlParser: true, useCreateIndex: true }, (err) => {
    if (err)
        throw err;
    console.log('Base de datos MONGO ONLINE');
});
// Starting both http & https servers
const httpServer = http_1.default.createServer(app);
httpServer.listen(process.env.PORT || 3000, () => {
    console.log('HTTP Server corriendo en puerto 3000 only HTTP');
});
