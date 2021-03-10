"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const http = require('https');
const fel_model_1 = require("../models/fel.model");
const moment = require("moment");
class FACTURA {
    constructor() { }
    crearXML(dataEmisor, dataReceptor, items, idcita, estado) {
        return __awaiter(this, void 0, void 0, function* () {
            // frases
            /*  let frases = '<dte:Frases>';
             for (let index = 0; index < items.codigoescenario; index++) {
                 frases += `
                 <dte:Frase CodigoEscenario = "${index + 1}" TipoFrase = "1" ></dte:Frase>
                 `
             }
             frases += '</dte:Frases>'; */
            let frases = `
        <dte:Frases>`;
            for (let index = 0; index < 2; index++) {
                frases += `
            <dte:Frase CodigoEscenario = "1" TipoFrase = "${index + 1}"></dte:Frase>
            `;
            }
            frases += `
        </dte:Frases>`;
            // Items
            let detalleItems = `
        <dte:Items>`;
            // Detalle servicios
            let detalleServicios = '';
            let detalleProductos = '';
            let detalleOrtopodologia = '';
            let detalleInsumos = '';
            let totales = 0;
            let numerolinea = 0;
            //Servicios
            if (items.servicios.length > 0) {
                let totalServicios = 0;
                items.servicios.forEach((elemento) => {
                    numerolinea++;
                    totalServicios = totalServicios + (elemento.precio * elemento.cantidad);
                    detalleServicios += `<dte:Item BienOServicio="S" NumeroLinea="${numerolinea}">
            <dte:Cantidad>${elemento.cantidad}</dte:Cantidad>
            <dte:UnidadMedida>UND</dte:UnidadMedida>
            <dte:Descripcion>${elemento.id.nombre}</dte:Descripcion>
            <dte:PrecioUnitario>${elemento.precio}</dte:PrecioUnitario>
            <dte:Precio>${elemento.precio * elemento.cantidad}</dte:Precio>
            <dte:Descuento>0.00</dte:Descuento>
            <dte:Impuestos>
                <dte:Impuesto>
                    <dte:NombreCorto>IVA</dte:NombreCorto>
                    <dte:CodigoUnidadGravable>1</dte:CodigoUnidadGravable>
                    <dte:MontoGravable>${((elemento.precio * elemento.cantidad) - ((elemento.precio * elemento.cantidad) * 0.12)).toFixed(2)}</dte:MontoGravable>
                    <dte:MontoImpuesto>${((elemento.precio * elemento.cantidad) * 0.12).toFixed(2)}</dte:MontoImpuesto>
                </dte:Impuesto>
            </dte:Impuestos>
            <dte:Total>${(elemento.precio * elemento.cantidad).toFixed(2)}</dte:Total>
        </dte:Item>`;
                });
                totales = totales + totalServicios;
                detalleItems = detalleItems + detalleServicios;
            }
            //Productos
            if (items.productos.length > 0) {
                let totalProducto = 0;
                items.productos.forEach((elemento) => {
                    numerolinea++;
                    totalProducto = totalProducto + (elemento.precio * elemento.cantidad);
                    detalleProductos += `<dte:Item BienOServicio="B" NumeroLinea="${numerolinea}">
            <dte:Cantidad>${elemento.cantidad}</dte:Cantidad>
            <dte:UnidadMedida>UND</dte:UnidadMedida>
            <dte:Descripcion>${elemento.id.nombre}</dte:Descripcion>
            <dte:PrecioUnitario>${elemento.precio}</dte:PrecioUnitario>
            <dte:Precio>${elemento.precio * elemento.cantidad}</dte:Precio>
            <dte:Descuento>0.00</dte:Descuento>
            <dte:Impuestos>
                <dte:Impuesto>
                    <dte:NombreCorto>IVA</dte:NombreCorto>
                    <dte:CodigoUnidadGravable>1</dte:CodigoUnidadGravable>
                    <dte:MontoGravable>${((elemento.precio * elemento.cantidad) - ((elemento.precio * elemento.cantidad) * 0.12)).toFixed(2)}</dte:MontoGravable>
                    <dte:MontoImpuesto>${((elemento.precio * elemento.cantidad) * 0.12).toFixed(2)}</dte:MontoImpuesto>
                </dte:Impuesto>
            </dte:Impuestos>
            <dte:Total>${elemento.precio * elemento.cantidad}</dte:Total>
        </dte:Item>`;
                });
                totales = totales + totalProducto;
                detalleItems = detalleItems + detalleProductos;
            }
            //Ortopodología
            if (items.ortopodologia.length > 0) {
                let totalOrtopodologia = 0;
                items.ortopodologia.forEach((elemento) => {
                    numerolinea++;
                    totalOrtopodologia = totalOrtopodologia + (elemento.precio * elemento.cantidad);
                    detalleOrtopodologia += `<dte:Item BienOServicio="B" NumeroLinea="${numerolinea}">
            <dte:Cantidad>${elemento.cantidad}</dte:Cantidad>
            <dte:UnidadMedida>UND</dte:UnidadMedida>
            <dte:Descripcion>${elemento.id.nombre}</dte:Descripcion>
            <dte:PrecioUnitario>${elemento.precio}</dte:PrecioUnitario>
            <dte:Precio>${elemento.precio * elemento.cantidad}</dte:Precio>
            <dte:Descuento>0.00</dte:Descuento>
            <dte:Impuestos>
                <dte:Impuesto>
                    <dte:NombreCorto>IVA</dte:NombreCorto>
                    <dte:CodigoUnidadGravable>1</dte:CodigoUnidadGravable>
                    <dte:MontoGravable>${((elemento.precio * elemento.cantidad) - ((elemento.precio * elemento.cantidad) * 0.12)).toFixed(2)}</dte:MontoGravable>
                    <dte:MontoImpuesto>${((elemento.precio * elemento.cantidad) * 0.12).toFixed(2)}</dte:MontoImpuesto>
                </dte:Impuesto>
            </dte:Impuestos>
            <dte:Total>${elemento.precio * elemento.cantidad}</dte:Total>
        </dte:Item>`;
                });
                totales = totales + totalOrtopodologia;
                detalleItems = detalleItems + detalleOrtopodologia;
            }
            //Insumos
            if (items.insumos.length > 0) {
                let totalInsumos = 0;
                items.insumos.forEach((elemento) => {
                    numerolinea++;
                    totalInsumos = totalInsumos + (elemento.precio * elemento.cantidad);
                    detalleInsumos += `<dte:Item BienOServicio="B" NumeroLinea="${numerolinea}">
            <dte:Cantidad>${elemento.cantidad}</dte:Cantidad>
            <dte:UnidadMedida>UND</dte:UnidadMedida>
            <dte:Descripcion>${elemento.id.nombre}</dte:Descripcion>
            <dte:PrecioUnitario>${elemento.precio}</dte:PrecioUnitario>
            <dte:Precio>${elemento.precio * elemento.cantidad}</dte:Precio>
            <dte:Descuento>0.00</dte:Descuento>
            <dte:Impuestos>
                <dte:Impuesto>
                    <dte:NombreCorto>IVA</dte:NombreCorto>
                    <dte:CodigoUnidadGravable>1</dte:CodigoUnidadGravable>
                    <dte:MontoGravable>${((elemento.precio * elemento.cantidad) - ((elemento.precio * elemento.cantidad) * 0.12)).toFixed(2)}</dte:MontoGravable>
                    <dte:MontoImpuesto>${((elemento.precio * elemento.cantidad) * 0.12).toFixed(2)}</dte:MontoImpuesto>
                </dte:Impuesto>
            </dte:Impuestos>
            <dte:Total>${elemento.precio * elemento.cantidad}</dte:Total>
        </dte:Item>`;
                });
                totales = totales + totalInsumos;
                detalleItems = detalleItems + detalleInsumos;
            }
            detalleItems = detalleItems + '</dte:Items>';
            //Totales 
            let Totales = `<dte:Totales>
        <dte:TotalImpuestos>
            <dte:TotalImpuesto NombreCorto="IVA" TotalMontoImpuesto="${(totales * 0.12).toFixed(2)}"></dte:TotalImpuesto>
        </dte:TotalImpuestos>
        <dte:GranTotal>${totales.toFixed(2)}</dte:GranTotal>
    </dte:Totales>`;
            let facturaXML = `<?xml versión="1.0" encoding="utf-8"?>`;
            facturaXML += `
        <dte:GTDocumento xmlns:ds="http://www.w3.org/2000/09/xmldsig#" xmlns:dte="http://www.sat.gob.gt/dte/fel/0.2.0" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" Version="0.1" xsi:schemaLocation="http://www.sat.gob.gt/dte/fel/0.2.0">
        <dte:SAT ClaseDocumento="dte">
            <dte:DTE ID="DatosCertificados">
                <dte:DatosEmision ID="DatosEmision">`;
            //Datos Generales
            facturaXML += `
        <dte:DatosGenerales CodigoMoneda="${dataEmisor.codigomoneda}" FechaHoraEmision="${dataEmisor.fechaemision}" Tipo="${dataEmisor.tipodocumento}"></dte:DatosGenerales>
        `;
            //Emisor
            facturaXML += `
        <dte:Emisor AfiliacionIVA="${dataEmisor.tipoafiliacion}" CodigoEstablecimiento="${dataEmisor.codigoestablecimiento}" CorreoEmisor="${dataEmisor.correoemisor}" NITEmisor="${dataEmisor.nitemisor}" NombreComercial="${dataEmisor.nombrecomercial}" NombreEmisor="${dataEmisor.nombreemisor}">
                    <dte:DireccionEmisor>
                        <dte:Direccion>${dataEmisor.direccion}</dte:Direccion>
                        <dte:CodigoPostal>${dataEmisor.codigopostal}</dte:CodigoPostal>
                        <dte:Municipio>${dataEmisor.municipio}</dte:Municipio>
                        <dte:Departamento>${dataEmisor.departamento}</dte:Departamento>
                        <dte:Pais>${dataEmisor.pais}</dte:Pais>
                    </dte:DireccionEmisor>
                </dte:Emisor>
                `;
            //Receptor
            facturaXML += ` <dte:Receptor CorreoReceptor="${dataReceptor.correoreceptor}" IDReceptor="${dataReceptor.nitreceptor}" NombreReceptor="${dataReceptor.nombrereceptor}">
                <dte:DireccionReceptor>
                    <dte:Direccion>${dataReceptor.direccion}</dte:Direccion>
                    <dte:CodigoPostal>${dataReceptor.codigopostal}</dte:CodigoPostal>
                    <dte:Municipio>${dataReceptor.municipio}</dte:Municipio>
                    <dte:Departamento>${dataReceptor.departamento}</dte:Departamento>
                    <dte:Pais>${dataReceptor.pais}</dte:Pais>
                </dte:DireccionReceptor>
            </dte:Receptor>`;
            //frases
            facturaXML = facturaXML + frases;
            //items
            facturaXML = facturaXML + detalleItems;
            //Totales
            facturaXML = facturaXML + Totales;
            //adenda
            facturaXML += `
        </dte:DatosEmision>
        </dte:DTE>
            <dte:Adenda>
                <Codigo_cliente>${dataReceptor.codigofactura}</Codigo_cliente>
                <Observaciones>${dataReceptor.paciente}</Observaciones>
            </dte:Adenda>
        </dte:SAT>
    </dte:GTDocumento>`;
            const respuesta = yield this.enviarXML(facturaXML);
            let resp2 = JSON.parse(respuesta);
            if (resp2['resultado'] === true) {
                const fechacreacion = moment().format();
                facturaXML = JSON.stringify(facturaXML);
                resp2 = JSON.stringify(resp2);
                //console.log(resp2);
                const dataFel = new fel_model_1.Fel({ idcita, xml: facturaXML, respuesta: resp2, estado: estado, fechacreacion });
                const re = yield dataFel.save();
            }
            return respuesta;
        });
    }
    enviarXML(xml) {
        return new Promise((resolve, reject) => {
            let options = {
                "method": "POST",
                "hostname": "certificador.feel.com.gt",
                "port": null,
                "path": "/fel/procesounificado/transaccion/v2/xml",
                "headers": {
                    "usuariofirma": "PREPAGASA",
                    "llavefirma": "49ea2280f749931d1b88fafbf1e38e1c",
                    "usuarioapi": "PREPAGASA",
                    "llaveapi": "0736666B247FF73634F0A04A7E52F189",
                    "identificador": "001",
                    "content-type": "text/xml",
                    "cache-control": "no-cache"
                }
            };
            let req = http.request(options, (res) => {
                let chunks = [];
                res.on("data", (chunk) => {
                    chunks.push(chunk);
                });
                res.on("end", () => {
                    let body = Buffer.concat(chunks);
                    //console.log(body.toString());
                    resolve(body.toString());
                    //resolve(JSON.parse(responseBody));
                });
            });
            req.on('error', (err) => {
                reject(err);
            });
            req.write(xml);
            req.end();
        });
    }
}
exports.FACTURA = FACTURA;
