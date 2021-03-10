const http = require('https');
import moment = require('moment');

import { DTE } from '../models/dte.model';
import { Cita } from '../models/cita.model';
import { Anulacionesdte } from '../models/anulacionesdte.model';
import { EMISOR, RECEPTOR, ITEMS } from '../interfaces/interfaces';



export class DOCTRIBUTARIOELECTRONICO {
    constructor() { }


    async  crearXMLFactura(dataEmisor: EMISOR, dataReceptor: RECEPTOR, items: ITEMS, idcita: string, factura: any, estado: boolean) {

        if (factura.cantidadanulacion === 1) {
            dataReceptor.codigofactura + "R"; // Revalidación de factura
        }

        // frases
        let frases = `
        <dte:Frases>
            <dte:Frase CodigoEscenario = "1" TipoFrase = "1"></dte:Frase>
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
        let descuentofactura = 0;

        //Servicios
        if (items.servicios.length > 0) {
            let totalServiciosQ = 0;
            let cantidadServicios = 0;
            let totalDescuento = 0;
            numerolinea++;

            items.servicios.forEach((elemento: any) => {
                cantidadServicios = cantidadServicios + elemento.cantidad;
                totalServiciosQ = totalServiciosQ + (elemento.precio * elemento.cantidad);
                totalDescuento = totalDescuento + elemento.descuento;
            });

            descuentofactura = totalDescuento;

            detalleServicios += `<dte:Item BienOServicio="S" NumeroLinea="${numerolinea}">
            <dte:Cantidad>1</dte:Cantidad>
            <dte:UnidadMedida>UND</dte:UnidadMedida>
            <dte:Descripcion>${cantidadServicios} Servicio (s)</dte:Descripcion>
            <dte:PrecioUnitario>${totalServiciosQ.toFixed(2)}</dte:PrecioUnitario>
            <dte:Precio>${totalServiciosQ.toFixed(2)}</dte:Precio>
            <dte:Descuento>${totalDescuento.toFixed(2)}</dte:Descuento>
            <dte:Impuestos>
                <dte:Impuesto>
                    <dte:NombreCorto>IVA</dte:NombreCorto>
                    <dte:CodigoUnidadGravable>1</dte:CodigoUnidadGravable>
                    <dte:MontoGravable>${((totalServiciosQ - totalDescuento) / 1.12).toFixed(2)}</dte:MontoGravable>
                    <dte:MontoImpuesto>${((totalServiciosQ - totalDescuento) - ((totalServiciosQ - totalDescuento) / 1.12)).toFixed(2)}</dte:MontoImpuesto>
                </dte:Impuesto>
            </dte:Impuestos>
            <dte:Total>${(totalServiciosQ - totalDescuento).toFixed(2)}</dte:Total>
        </dte:Item>`;


            totales = totales + totalServiciosQ - totalDescuento;
            detalleItems = detalleItems + detalleServicios;
        }

        //Productos
        if (items.productos.length > 0) {
            let totalProductoQ = 0;
            let cantidadProductos = 0;
            numerolinea++;

            items.productos.forEach((elemento: any) => {
                cantidadProductos = cantidadProductos + elemento.cantidad;
                totalProductoQ = totalProductoQ + (elemento.precio * elemento.cantidad);
            });
            detalleProductos += `<dte:Item BienOServicio="B" NumeroLinea="${numerolinea}">
            <dte:Cantidad>1</dte:Cantidad>
            <dte:UnidadMedida>UND</dte:UnidadMedida>
            <dte:Descripcion>${cantidadProductos} Producto (s)</dte:Descripcion>
            <dte:PrecioUnitario>${totalProductoQ.toFixed(2)}</dte:PrecioUnitario>
            <dte:Precio>${totalProductoQ.toFixed(2)}</dte:Precio>
            <dte:Descuento>0.00</dte:Descuento>
            <dte:Impuestos>
                <dte:Impuesto>
                    <dte:NombreCorto>IVA</dte:NombreCorto>
                    <dte:CodigoUnidadGravable>1</dte:CodigoUnidadGravable>
                    <dte:MontoGravable>${(totalProductoQ / 1.12).toFixed(2)}</dte:MontoGravable>
                    <dte:MontoImpuesto>${(totalProductoQ - (totalProductoQ / 1.12)).toFixed(2)}</dte:MontoImpuesto>
                </dte:Impuesto>
            </dte:Impuestos>
            <dte:Total>${totalProductoQ.toFixed(2)}</dte:Total>
        </dte:Item>`;

            totales = totales + totalProductoQ;
            detalleItems = detalleItems + detalleProductos;
        }


        //Ortopodología
        if (items.ortopodologia.length > 0) {
            let totalOrtopodologiaQ = 0;
            let cantidadOrtopodologia = 0;
            numerolinea++;

            items.ortopodologia.forEach((elemento: any) => {
                totalOrtopodologiaQ = totalOrtopodologiaQ + (elemento.precio * elemento.cantidad);
                cantidadOrtopodologia = cantidadOrtopodologia + elemento.cantidad;
            });

            detalleOrtopodologia += `<dte:Item BienOServicio="B" NumeroLinea="${numerolinea}">
            <dte:Cantidad>1</dte:Cantidad>
            <dte:UnidadMedida>UND</dte:UnidadMedida>
            <dte:Descripcion>${cantidadOrtopodologia} Ortopodología</dte:Descripcion>
            <dte:PrecioUnitario>${totalOrtopodologiaQ.toFixed(2)}</dte:PrecioUnitario>
            <dte:Precio>${totalOrtopodologiaQ.toFixed(2)}</dte:Precio>
            <dte:Descuento>0.00</dte:Descuento>
            <dte:Impuestos>
                <dte:Impuesto>
                    <dte:NombreCorto>IVA</dte:NombreCorto>
                    <dte:CodigoUnidadGravable>1</dte:CodigoUnidadGravable>
                    <dte:MontoGravable>${(totalOrtopodologiaQ / 1.12).toFixed(2)}</dte:MontoGravable>
                    <dte:MontoImpuesto>${(totalOrtopodologiaQ - (totalOrtopodologiaQ / 1.12)).toFixed(2)}</dte:MontoImpuesto>
                </dte:Impuesto>
            </dte:Impuestos>
            <dte:Total>${totalOrtopodologiaQ.toFixed(2)}</dte:Total>
        </dte:Item>`;

            totales = totales + totalOrtopodologiaQ;
            detalleItems = detalleItems + detalleOrtopodologia;
        }



        //Insumos
        if (items.insumos.length > 0) {
            let totalInsumosQ = 0;
            let cantidadInsumos = 0;
            numerolinea++;


            items.insumos.forEach((elemento: any) => {
                totalInsumosQ = totalInsumosQ + (elemento.precio * elemento.cantidad);
                cantidadInsumos = cantidadInsumos + elemento.cantidad;

            });

            detalleInsumos += `<dte:Item BienOServicio="B" NumeroLinea="${numerolinea}">
            <dte:Cantidad>1</dte:Cantidad>
            <dte:UnidadMedida>UND</dte:UnidadMedida>
            <dte:Descripcion>${cantidadInsumos} Insumo (s)</dte:Descripcion>
            <dte:PrecioUnitario>${totalInsumosQ.toFixed(2)}</dte:PrecioUnitario>
            <dte:Precio>${totalInsumosQ.toFixed(2)}</dte:Precio>
            <dte:Descuento>0.00</dte:Descuento>
            <dte:Impuestos>
                <dte:Impuesto>
                    <dte:NombreCorto>IVA</dte:NombreCorto>
                    <dte:CodigoUnidadGravable>1</dte:CodigoUnidadGravable>
                    <dte:MontoGravable>${(totalInsumosQ / 1.12).toFixed(2)}</dte:MontoGravable>
                    <dte:MontoImpuesto>${(totalInsumosQ - (totalInsumosQ / 1.12)).toFixed(2)}</dte:MontoImpuesto>
                </dte:Impuesto>
            </dte:Impuestos>
            <dte:Total>${totalInsumosQ.toFixed(2)}</dte:Total>
        </dte:Item>`;

            totales = totales + totalInsumosQ;
            detalleItems = detalleItems + detalleInsumos;
        }

        detalleItems = detalleItems + '</dte:Items>';

        //Totales 
        let Totales = `<dte:Totales>
        <dte:TotalImpuestos>
            <dte:TotalImpuesto NombreCorto="IVA" TotalMontoImpuesto="${(totales - (totales / 1.12)).toFixed(2)}"></dte:TotalImpuesto>
        </dte:TotalImpuestos>
        <dte:GranTotal>${totales.toFixed(2)}</dte:GranTotal>
    </dte:Totales>`;

        let facturaXML = `<?xml version="1.0" encoding="UTF-8" standalone="no" ?>`;
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

        //bloquea el doc para que no se pueda añadir mas productos durante el proceso de certificación 
        await Cita.updateOne({ _id: idcita, estado: true, finalizada: false }, { $set: { finalizada: true } });

        const respuesta: any = await this.enviarXML(facturaXML, dataReceptor.codigofactura);

        let resp2 = JSON.parse(respuesta);



        if (resp2['resultado'] === true) {
            //desbloquea el doc
            await Cita.updateOne({ _id: idcita, estado: true, finalizada: true }, { $set: { finalizada: false } });

            const uuid = resp2['uuid'];
            const nofactura = resp2['numero'];
            const fechacertificacion = resp2['fecha'];

            // verificar el porque finalizada: true de este query ?? // creo que no es necesario, analizar si eliminarlo
            await Cita.updateOne({ _id: idcita, estado: true, finalizada: true }, { $set: { 'factura.descuento': descuentofactura, 'factura.nofactura': nofactura, 'factura.uuid': uuid, 'factura.facturaanulada': false, 'factura.fecha': fechacertificacion } });

            const fechacreacion = moment().format();

            facturaXML = JSON.stringify(facturaXML);
            resp2 = JSON.stringify(resp2);

            const tipo = 'FACT'
            const dataDTE = new DTE({ idcita, tipo, xml: facturaXML, respuesta: resp2, estado: estado, fechacreacion });
            await dataDTE.save();

        } else {
            //desbloquea el doc
            await Cita.updateOne({ _id: idcita, estado: true, finalizada: true }, { $set: { finalizada: false } });
        }

        return respuesta;
    }

    async  crearXMLNCREDITO(dataEmisor: EMISOR, dataReceptor: RECEPTOR, items: ITEMS, idcita: string, factura: any, estado: boolean, observacionescredito: string) {
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
        const identificadordte = dataReceptor.codigofactura + 'f';

        //Servicios
        if (items.servicios.length > 0) {
            let totalServiciosQ = 0;
            let cantidadServicios = 0;
            let totalDescuento = 0;
            numerolinea++;

            items.servicios.forEach((elemento: any) => {
                cantidadServicios = cantidadServicios + elemento.cantidad;
                totalServiciosQ = totalServiciosQ + (elemento.precio * elemento.cantidad);
                totalDescuento = totalDescuento + elemento.descuento;
            });

            detalleServicios += `<dte:Item BienOServicio="S" NumeroLinea="${numerolinea}">
            <dte:Cantidad>1</dte:Cantidad>
            <dte:UnidadMedida>UND</dte:UnidadMedida>
            <dte:Descripcion>${cantidadServicios} Servicio (s)</dte:Descripcion>
            <dte:PrecioUnitario>${totalServiciosQ.toFixed(2)}</dte:PrecioUnitario>
            <dte:Precio>${totalServiciosQ.toFixed(2)}</dte:Precio>
            <dte:Descuento>${totalDescuento.toFixed(2)}</dte:Descuento>
            <dte:Impuestos>
                <dte:Impuesto>
                    <dte:NombreCorto>IVA</dte:NombreCorto>
                    <dte:CodigoUnidadGravable>1</dte:CodigoUnidadGravable>
                    <dte:MontoGravable>${((totalServiciosQ - totalDescuento) / 1.12).toFixed(2)}</dte:MontoGravable>
                    <dte:MontoImpuesto>${((totalServiciosQ - totalDescuento) - ((totalServiciosQ - totalDescuento) / 1.12)).toFixed(2)}</dte:MontoImpuesto>
                </dte:Impuesto>
            </dte:Impuestos>
            <dte:Total>${(totalServiciosQ - totalDescuento).toFixed(2)}</dte:Total>
        </dte:Item>`;


            totales = totales + totalServiciosQ - totalDescuento;
            detalleItems = detalleItems + detalleServicios;
        }

        //Productos
        if (items.productos.length > 0) {
            let totalProductoQ = 0;
            let cantidadProductos = 0;
            numerolinea++;

            items.productos.forEach((elemento: any) => {
                cantidadProductos = cantidadProductos + elemento.cantidad;
                totalProductoQ = totalProductoQ + (elemento.precio * elemento.cantidad);
            });
            detalleProductos += `<dte:Item BienOServicio="B" NumeroLinea="${numerolinea}">
            <dte:Cantidad>1</dte:Cantidad>
            <dte:UnidadMedida>UND</dte:UnidadMedida>
            <dte:Descripcion>${cantidadProductos} Producto (s)</dte:Descripcion>
            <dte:PrecioUnitario>${totalProductoQ.toFixed(2)}</dte:PrecioUnitario>
            <dte:Precio>${totalProductoQ.toFixed(2)}</dte:Precio>
            <dte:Descuento>0.00</dte:Descuento>
            <dte:Impuestos>
                <dte:Impuesto>
                    <dte:NombreCorto>IVA</dte:NombreCorto>
                    <dte:CodigoUnidadGravable>1</dte:CodigoUnidadGravable>
                    <dte:MontoGravable>${(totalProductoQ / 1.12).toFixed(2)}</dte:MontoGravable>
                    <dte:MontoImpuesto>${(totalProductoQ - (totalProductoQ / 1.12)).toFixed(2)}</dte:MontoImpuesto>
                </dte:Impuesto>
            </dte:Impuestos>
            <dte:Total>${totalProductoQ.toFixed(2)}</dte:Total>
        </dte:Item>`;

            totales = totales + totalProductoQ;
            detalleItems = detalleItems + detalleProductos;
        }


        //Ortopodología
        if (items.ortopodologia.length > 0) {
            let totalOrtopodologiaQ = 0;
            let cantidadOrtopodologia = 0;
            numerolinea++;

            items.ortopodologia.forEach((elemento: any) => {
                totalOrtopodologiaQ = totalOrtopodologiaQ + (elemento.precio * elemento.cantidad);
                cantidadOrtopodologia = cantidadOrtopodologia + elemento.cantidad;
            });

            detalleOrtopodologia += `<dte:Item BienOServicio="B" NumeroLinea="${numerolinea}">
            <dte:Cantidad>1</dte:Cantidad>
            <dte:UnidadMedida>UND</dte:UnidadMedida>
            <dte:Descripcion>${cantidadOrtopodologia} Ortopodología</dte:Descripcion>
            <dte:PrecioUnitario>${totalOrtopodologiaQ.toFixed(2)}</dte:PrecioUnitario>
            <dte:Precio>${totalOrtopodologiaQ.toFixed(2)}</dte:Precio>
            <dte:Descuento>0.00</dte:Descuento>
            <dte:Impuestos>
                <dte:Impuesto>
                    <dte:NombreCorto>IVA</dte:NombreCorto>
                    <dte:CodigoUnidadGravable>1</dte:CodigoUnidadGravable>
                    <dte:MontoGravable>${(totalOrtopodologiaQ / 1.12).toFixed(2)}</dte:MontoGravable>
                    <dte:MontoImpuesto>${(totalOrtopodologiaQ - (totalOrtopodologiaQ / 1.12)).toFixed(2)}</dte:MontoImpuesto>
                </dte:Impuesto>
            </dte:Impuestos>
            <dte:Total>${totalOrtopodologiaQ.toFixed(2)}</dte:Total>
        </dte:Item>`;

            totales = totales + totalOrtopodologiaQ;
            detalleItems = detalleItems + detalleOrtopodologia;
        }



        //Insumos
        if (items.insumos.length > 0) {
            let totalInsumosQ = 0;
            let cantidadInsumos = 0;
            numerolinea++;


            items.insumos.forEach((elemento: any) => {
                totalInsumosQ = totalInsumosQ + (elemento.precio * elemento.cantidad);
                cantidadInsumos = cantidadInsumos + elemento.cantidad;

            });

            detalleInsumos += `<dte:Item BienOServicio="B" NumeroLinea="${numerolinea}">
            <dte:Cantidad>1</dte:Cantidad>
            <dte:UnidadMedida>UND</dte:UnidadMedida>
            <dte:Descripcion>${cantidadInsumos} Insumo (s)</dte:Descripcion>
            <dte:PrecioUnitario>${totalInsumosQ.toFixed(2)}</dte:PrecioUnitario>
            <dte:Precio>${totalInsumosQ.toFixed(2)}</dte:Precio>
            <dte:Descuento>0.00</dte:Descuento>
            <dte:Impuestos>
                <dte:Impuesto>
                    <dte:NombreCorto>IVA</dte:NombreCorto>
                    <dte:CodigoUnidadGravable>1</dte:CodigoUnidadGravable>
                    <dte:MontoGravable>${(totalInsumosQ / 1.12).toFixed(2)}</dte:MontoGravable>
                    <dte:MontoImpuesto>${(totalInsumosQ - (totalInsumosQ / 1.12)).toFixed(2)}</dte:MontoImpuesto>
                </dte:Impuesto>
            </dte:Impuestos>
            <dte:Total>${totalInsumosQ.toFixed(2)}</dte:Total>
        </dte:Item>`;

            totales = totales + totalInsumosQ;
            detalleItems = detalleItems + detalleInsumos;
        }

        detalleItems = detalleItems + '</dte:Items>';

        //Totales 
        let Totales = `<dte:Totales>
        <dte:TotalImpuestos>
            <dte:TotalImpuesto NombreCorto="IVA" TotalMontoImpuesto="${(totales - (totales / 1.12)).toFixed(2)}"></dte:TotalImpuesto>
        </dte:TotalImpuestos>
        <dte:GranTotal>${totales.toFixed(2)}</dte:GranTotal>
    </dte:Totales>`;

        const fechaformateada = moment(factura.fecha).format("YYYY-MM-DD");

        // Complementos
        let complementos = `
    <dte:Complementos>
    <dte:Complemento IDComplemento="Notas" NombreComplemento="Notas" URIComplemento="http://www.sat.gob.gt/fel/notas.xsd">
        <cno:ReferenciasNota xmlns:cno="http://www.sat.gob.gt/face2/ComplementoReferenciaNota/0.1.0" FechaEmisionDocumentoOrigen="${fechaformateada}" MotivoAjuste="${observacionescredito}" NumeroAutorizacionDocumentoOrigen="${factura.uuid}" Version="0.0" xsi:schemaLocation="http://www.sat.gob.gt/face2/ComplementoReferenciaNota/0.1.0 C:\Users\User\Desktop\FEL\Esquemas\GT_Complemento_Referencia_Nota-0.1.0.xsd"/>
    </dte:Complemento>
</dte:Complementos>
`;

        let nCreditoXML = `<?xml version="1.0" encoding="UTF-8" standalone="no" ?>`;
        nCreditoXML += `
        <dte:GTDocumento xmlns:ds="http://www.w3.org/2000/09/xmldsig#" xmlns:dte="http://www.sat.gob.gt/dte/fel/0.2.0" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" Version="0.1" xsi:schemaLocation="http://www.sat.gob.gt/dte/fel/0.2.0">
        <dte:SAT ClaseDocumento="dte">
            <dte:DTE ID="DatosCertificados">
                <dte:DatosEmision ID="DatosEmision">`;

        //Datos Generales
        nCreditoXML += `
        <dte:DatosGenerales CodigoMoneda="${dataEmisor.codigomoneda}" FechaHoraEmision="${dataEmisor.fechaemision}" Tipo="${dataEmisor.tipodocumento}"></dte:DatosGenerales>
        `;

        //Emisor
        nCreditoXML += `
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
        nCreditoXML += ` <dte:Receptor CorreoReceptor="${dataReceptor.correoreceptor}" IDReceptor="${dataReceptor.nitreceptor}" NombreReceptor="${dataReceptor.nombrereceptor}">
                <dte:DireccionReceptor>
                    <dte:Direccion>${dataReceptor.direccion}</dte:Direccion>
                    <dte:CodigoPostal>${dataReceptor.codigopostal}</dte:CodigoPostal>
                    <dte:Municipio>${dataReceptor.municipio}</dte:Municipio>
                    <dte:Departamento>${dataReceptor.departamento}</dte:Departamento>
                    <dte:Pais>${dataReceptor.pais}</dte:Pais>
                </dte:DireccionReceptor>
            </dte:Receptor>`;

        //items
        nCreditoXML = nCreditoXML + detalleItems;

        //Totales
        nCreditoXML = nCreditoXML + Totales + complementos;

        //adenda
        nCreditoXML += `
        </dte:DatosEmision>
        </dte:DTE>
            <dte:Adenda>
                <Codigo_cliente>${dataReceptor.idreceptor}</Codigo_cliente>
                <Observaciones>${dataReceptor.paciente}</Observaciones>
            </dte:Adenda>
        </dte:SAT>
    </dte:GTDocumento>`;

        const respuesta: any = await this.enviarXML(nCreditoXML, identificadordte);
        let resp2 = JSON.parse(respuesta);
        if (resp2['resultado'] === true) {

            const uuid = resp2['uuid'];
            const notacredito = resp2['numero'];
            const fechacertificacion = resp2['fecha'];

            await Cita.updateOne({ _id: idcita, estado: true, finalizada: true }, { $set: { 'notacredito.nonotacredito': notacredito, 'notacredito.uuid': uuid, 'notacredito.notacreditoemitida': true, 'factura.observacionesnotacredito': observacionescredito, 'notacredito.fechaemision': fechacertificacion } });

            const fechacreacion = moment().format();

            nCreditoXML = JSON.stringify(nCreditoXML);
            resp2 = JSON.stringify(resp2);

            const tipo = 'NCRE'
            const dataDTE = new DTE({ idcita, tipo, xml: nCreditoXML, respuesta: resp2, estado: estado, fechacreacion });
            const re = await dataDTE.save();
        }

        return respuesta;
    }


    async  crearXMLNDEBITO(dataEmisor: EMISOR, dataReceptor: RECEPTOR, items: ITEMS, idcita: string, factura: any, estado: boolean, observacionesdebito: string) {
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
        const identificadordte = dataReceptor.codigofactura + 'D';

        //Servicios
        if (items.servicios.length > 0) {
            let totalServiciosQ = 0;
            let cantidadServicios = 0;
            let totalDescuento = 0;
            numerolinea++;

            items.servicios.forEach((elemento: any) => {
                cantidadServicios = cantidadServicios + elemento.cantidad;
                totalServiciosQ = totalServiciosQ + (elemento.precio * elemento.cantidad);
                totalDescuento = totalDescuento + elemento.descuento;
            });

            detalleServicios += `<dte:Item BienOServicio="S" NumeroLinea="${numerolinea}">
            <dte:Cantidad>1</dte:Cantidad>
            <dte:UnidadMedida>UND</dte:UnidadMedida>
            <dte:Descripcion>${cantidadServicios} Servicio (s)</dte:Descripcion>
            <dte:PrecioUnitario>${totalServiciosQ.toFixed(2)}</dte:PrecioUnitario>
            <dte:Precio>${totalServiciosQ.toFixed(2)}</dte:Precio>
            <dte:Descuento>${ totalDescuento.toFixed(2)}</dte:Descuento>
            <dte:Impuestos>
                <dte:Impuesto>
                    <dte:NombreCorto>IVA</dte:NombreCorto>
                    <dte:CodigoUnidadGravable>1</dte:CodigoUnidadGravable>
                    <dte:MontoGravable>${((totalServiciosQ - totalDescuento) / 1.12).toFixed(2)}</dte:MontoGravable>
                    <dte:MontoImpuesto>${((totalServiciosQ - totalDescuento) - ((totalServiciosQ - totalDescuento) / 1.12)).toFixed(2)}</dte:MontoImpuesto>
                </dte:Impuesto>
            </dte:Impuestos>
            <dte:Total>${(totalServiciosQ - totalDescuento).toFixed(2)}</dte:Total>
        </dte:Item>`;


            totales = totales + totalServiciosQ - totalDescuento;
            detalleItems = detalleItems + detalleServicios;
        }

        //Productos
        if (items.productos.length > 0) {
            let totalProductoQ = 0;
            let cantidadProductos = 0;
            numerolinea++;

            items.productos.forEach((elemento: any) => {
                cantidadProductos = cantidadProductos + elemento.cantidad;
                totalProductoQ = totalProductoQ + (elemento.precio * elemento.cantidad);
            });
            detalleProductos += `<dte:Item BienOServicio="B" NumeroLinea="${numerolinea}">
            <dte:Cantidad>1</dte:Cantidad>
            <dte:UnidadMedida>UND</dte:UnidadMedida>
            <dte:Descripcion>${cantidadProductos} Producto (s)</dte:Descripcion>
            <dte:PrecioUnitario>${totalProductoQ.toFixed(2)}</dte:PrecioUnitario>
            <dte:Precio>${totalProductoQ.toFixed(2)}</dte:Precio>
            <dte:Descuento>0.00</dte:Descuento>
            <dte:Impuestos>
                <dte:Impuesto>
                    <dte:NombreCorto>IVA</dte:NombreCorto>
                    <dte:CodigoUnidadGravable>1</dte:CodigoUnidadGravable>
                    <dte:MontoGravable>${(totalProductoQ / 1.12).toFixed(2)}</dte:MontoGravable>
                    <dte:MontoImpuesto>${(totalProductoQ - (totalProductoQ / 1.12)).toFixed(2)}</dte:MontoImpuesto>
                </dte:Impuesto>
            </dte:Impuestos>
            <dte:Total>${totalProductoQ.toFixed(2)}</dte:Total>
        </dte:Item>`;

            totales = totales + totalProductoQ;
            detalleItems = detalleItems + detalleProductos;
        }


        //Ortopodología
        if (items.ortopodologia.length > 0) {
            let totalOrtopodologiaQ = 0;
            let cantidadOrtopodologia = 0;
            numerolinea++;

            items.ortopodologia.forEach((elemento: any) => {
                totalOrtopodologiaQ = totalOrtopodologiaQ + (elemento.precio * elemento.cantidad);
                cantidadOrtopodologia = cantidadOrtopodologia + elemento.cantidad;
            });

            detalleOrtopodologia += `<dte:Item BienOServicio="B" NumeroLinea="${numerolinea}">
            <dte:Cantidad>1</dte:Cantidad>
            <dte:UnidadMedida>UND</dte:UnidadMedida>
            <dte:Descripcion>${cantidadOrtopodologia} Ortopodología</dte:Descripcion>
            <dte:PrecioUnitario>${totalOrtopodologiaQ.toFixed(2)}</dte:PrecioUnitario>
            <dte:Precio>${totalOrtopodologiaQ.toFixed(2)}</dte:Precio>
            <dte:Descuento>0.00</dte:Descuento>
            <dte:Impuestos>
                <dte:Impuesto>
                    <dte:NombreCorto>IVA</dte:NombreCorto>
                    <dte:CodigoUnidadGravable>1</dte:CodigoUnidadGravable>
                    <dte:MontoGravable>${(totalOrtopodologiaQ / 1.12).toFixed(2)}</dte:MontoGravable>
                    <dte:MontoImpuesto>${(totalOrtopodologiaQ - (totalOrtopodologiaQ / 1.12)).toFixed(2)}</dte:MontoImpuesto>
                </dte:Impuesto>
            </dte:Impuestos>
            <dte:Total>${totalOrtopodologiaQ.toFixed(2)}</dte:Total>
        </dte:Item>`;

            totales = totales + totalOrtopodologiaQ;
            detalleItems = detalleItems + detalleOrtopodologia;
        }



        //Insumos
        if (items.insumos.length > 0) {
            let totalInsumosQ = 0;
            let cantidadInsumos = 0;
            numerolinea++;


            items.insumos.forEach((elemento: any) => {
                totalInsumosQ = totalInsumosQ + (elemento.precio * elemento.cantidad);
                cantidadInsumos = cantidadInsumos + elemento.cantidad;

            });

            detalleInsumos += `<dte:Item BienOServicio="B" NumeroLinea="${numerolinea}">
            <dte:Cantidad>1</dte:Cantidad>
            <dte:UnidadMedida>UND</dte:UnidadMedida>
            <dte:Descripcion>${cantidadInsumos} Insumo (s)</dte:Descripcion>
            <dte:PrecioUnitario>${totalInsumosQ.toFixed(2)}</dte:PrecioUnitario>
            <dte:Precio>${totalInsumosQ.toFixed(2)}</dte:Precio>
            <dte:Descuento>0.00</dte:Descuento>
            <dte:Impuestos>
                <dte:Impuesto>
                    <dte:NombreCorto>IVA</dte:NombreCorto>
                    <dte:CodigoUnidadGravable>1</dte:CodigoUnidadGravable>
                    <dte:MontoGravable>${(totalInsumosQ / 1.12).toFixed(2)}</dte:MontoGravable>
                    <dte:MontoImpuesto>${(totalInsumosQ - (totalInsumosQ / 1.12)).toFixed(2)}</dte:MontoImpuesto>
                </dte:Impuesto>
            </dte:Impuestos>
            <dte:Total>${totalInsumosQ.toFixed(2)}</dte:Total>
        </dte:Item>`;

            totales = totales + totalInsumosQ;
            detalleItems = detalleItems + detalleInsumos;
        }

        detalleItems = detalleItems + '</dte:Items>';

        //Totales 
        let Totales = `<dte:Totales>
        <dte:TotalImpuestos>
            <dte:TotalImpuesto NombreCorto="IVA" TotalMontoImpuesto="${(totales - (totales / 1.12)).toFixed(2)}"></dte:TotalImpuesto>
        </dte:TotalImpuestos>
        <dte:GranTotal>${totales.toFixed(2)}</dte:GranTotal>
    </dte:Totales>`;

        const fechaformateada = moment(factura.fecha).format("YYYY-MM-DD");

        // Complementos
        let complementos = `
    <dte:Complementos>
    <dte:Complemento IDComplemento="Notas" NombreComplemento="Notas" URIComplemento="http://www.sat.gob.gt/fel/notas.xsd">
        <cno:ReferenciasNota xmlns:cno="http://www.sat.gob.gt/face2/ComplementoReferenciaNota/0.1.0" FechaEmisionDocumentoOrigen="${fechaformateada}" MotivoAjuste="${observacionesdebito}" NumeroAutorizacionDocumentoOrigen="${factura.uuid}" Version="0.0" xsi:schemaLocation="http://www.sat.gob.gt/face2/ComplementoReferenciaNota/0.1.0 C:\Users\User\Desktop\FEL\Esquemas\GT_Complemento_Referencia_Nota-0.1.0.xsd"/>
    </dte:Complemento>
</dte:Complementos>
`;

        let nCreditoXML = `<?xml version="1.0" encoding="UTF-8" standalone="no" ?>`;
        nCreditoXML += `
        <dte:GTDocumento xmlns:ds="http://www.w3.org/2000/09/xmldsig#" xmlns:dte="http://www.sat.gob.gt/dte/fel/0.2.0" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" Version="0.1" xsi:schemaLocation="http://www.sat.gob.gt/dte/fel/0.2.0">
        <dte:SAT ClaseDocumento="dte">
            <dte:DTE ID="DatosCertificados">
                <dte:DatosEmision ID="DatosEmision">`;

        //Datos Generales
        nCreditoXML += `
        <dte:DatosGenerales CodigoMoneda="${dataEmisor.codigomoneda}" FechaHoraEmision="${dataEmisor.fechaemision}" Tipo="${dataEmisor.tipodocumento}"></dte:DatosGenerales>
        `;

        //Emisor
        nCreditoXML += `
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
        nCreditoXML += ` <dte:Receptor CorreoReceptor="${dataReceptor.correoreceptor}" IDReceptor="${dataReceptor.nitreceptor}" NombreReceptor="${dataReceptor.nombrereceptor}">
                <dte:DireccionReceptor>
                    <dte:Direccion>${dataReceptor.direccion}</dte:Direccion>
                    <dte:CodigoPostal>${dataReceptor.codigopostal}</dte:CodigoPostal>
                    <dte:Municipio>${dataReceptor.municipio}</dte:Municipio>
                    <dte:Departamento>${dataReceptor.departamento}</dte:Departamento>
                    <dte:Pais>${dataReceptor.pais}</dte:Pais>
                </dte:DireccionReceptor>
            </dte:Receptor>`;

        //items
        nCreditoXML = nCreditoXML + detalleItems;

        //Totales
        nCreditoXML = nCreditoXML + Totales + complementos;

        //adenda
        nCreditoXML += `
        </dte:DatosEmision>
        </dte:DTE>
            <dte:Adenda>
                <Codigo_cliente>${dataReceptor.idreceptor}</Codigo_cliente>
                <Observaciones>${dataReceptor.paciente}</Observaciones>
            </dte:Adenda>
        </dte:SAT>
    </dte:GTDocumento>`;

        const respuesta: any = await this.enviarXML(nCreditoXML, identificadordte);
        let resp2 = JSON.parse(respuesta);
        if (resp2['resultado'] === true) {

            const uuid = resp2['uuid'];
            const notadebito = resp2['numero'];
            const fechacertificacion = resp2['fecha'];
            await Cita.updateOne({ _id: idcita, estado: true, finalizada: true }, { $set: { 'notadebito.notadebito': notadebito, 'notadebito.uuidnotadebito': uuid, 'notadebito.notadebitoemitida': true, 'notadebito.observacionesnotadebito': observacionesdebito, 'notadebito.fechacertificacion': fechacertificacion } });

            const fechacreacion = moment().format();

            nCreditoXML = JSON.stringify(nCreditoXML);
            resp2 = JSON.stringify(resp2);

            const tipo = 'NDEB'
            const dataDTE = new DTE({ idcita, tipo, xml: nCreditoXML, respuesta: resp2, estado: estado, fechacreacion });
            await dataDTE.save();
        }

        return respuesta;
    }

    async  crearXMLANULACIONDTE(dataEmisor: EMISOR, dataReceptor: RECEPTOR, idcita: string, factura: any, motivoanulacion: string) {

        const fechaformateada = moment(factura.fecha).format();
        const fechahoraanulacion = moment().format();
        const identificadordte = dataReceptor.codigofactura + 'A';

        let anulacionXML = `<?xml version="1.0" encoding="UTF-8" standalone="no" ?>`;
        anulacionXML += `
        <dte:GTAnulacionDocumento xmlns:ds="http://www.w3.org/2000/09/xmldsig#" xmlns:dte="http://www.sat.gob.gt/dte/fel/0.1.0" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" Version="0.1" xsi:schemaLocation="http://www.sat.gob.gt/dte/fel/0.1.0">
            <dte:SAT>
                <dte:AnulacionDTE ID="DatosCertificados">`;

        //Datos Generales
        anulacionXML += `
        <dte:DatosGenerales  ID="DatosAnulacion" NumeroDocumentoAAnular="${factura.uuid}" NITEmisor="${dataEmisor.nitemisor}" IDReceptor="${dataReceptor.nitreceptor}" FechaEmisionDocumentoAnular="${fechaformateada}" FechaHoraAnulacion="${fechahoraanulacion}" MotivoAnulacion="${motivoanulacion}"></dte:DatosGenerales>`;

        //FIN
        anulacionXML += `
        </dte:AnulacionDTE>
        </dte:SAT>
    </dte:GTAnulacionDocumento>`;

        const respuesta: any = await this.enviarXML(anulacionXML, identificadordte);
        let resp2 = JSON.parse(respuesta);
        if (resp2['resultado'] === true) {

            const uuid = resp2['uuid'];
            const numero = resp2['numero'];
            const fechacertificacion = resp2['fecha'];

            await Cita.updateOne({ _id: idcita, estado: true, finalizada: true }, { $set: { 'factura.uuidfacturaanulada': uuid, 'factura.facturaanulada': true, 'factura.motivoanulacionfactura': motivoanulacion, 'factura.cantidadanulacion': 1 } });

            anulacionXML = JSON.stringify(anulacionXML);
            const anulacionesdte = new Anulacionesdte({ idcita, identificador: identificadordte, numero: numero, tipo: 'FACT', uuid, xml: anulacionXML, fechaanulacion: fechacertificacion });
            await anulacionesdte.save();

        }

        return respuesta;
    }

    enviarXML(xml: string, identificador: string) {

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
                    "identificador": identificador,
                    "content-type": "text/xml; charset=utf-8",
                    "cache-control": "no-cache"
                }
            };
            let req = http.request(options, (res: any) => {
                let chunks: any[] = [];

                res.on("data", (chunk: any) => {
                    chunks.push(chunk);
                });

                res.on("end", () => {
                    let body = Buffer.concat(chunks);
                    //console.log(body.toString());
                    resolve(body.toString());
                    //resolve(JSON.parse(responseBody));
                });


            });

            req.on('error', (err: any) => {
                reject(err);
            });
            req.write(xml);
            req.end();

        });
    }

    imprimirDTE(uuid: string) {
        return new Promise((resolve, reject) => {
            let options = {
                "method": "GET",
                "hostname": "report.feel.com.gt",
                "port": null,
                "path": "/ingfacereport/ingfacereport_documento?uuid=" + uuid,
                "headers": {
                    "usuariofirma": "PREPAGASA",
                    "llavefirma": "49ea2280f749931d1b88fafbf1e38e1c",
                    "usuarioapi": "PREPAGASA",
                    "llaveapi": "0736666B247FF73634F0A04A7E52F189",
                    "identificador": "001",
                    "cache-control": "no-cache"
                }
            };
            let req = http.request(options, (response: any) => {
                let chunks: any[] = [];

                response.on("data", (chunk: any) => {
                    chunks.push(chunk);
                });


                response.on("end", () => {
                    let body = Buffer.concat(chunks).toString('base64');
                    //let body = Buffer.concat(chunks).toString('utf8');
                    resolve(body);
                });


            });

            req.on('error', (err: any) => {
                reject(err);
            });
            req.end();

        });

    }

}

