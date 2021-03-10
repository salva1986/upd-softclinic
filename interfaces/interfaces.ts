export interface EMISOR {
    codigoestablecimiento: number;
    codigomoneda: string;
    codigopostal: string;
    correoemisor: string;
    departamento: string;
    municipio: string;
    direccion: string;
    nitemisor: string;
    nombrecomercial: string;
    nombreemisor: string;
    pais: string;
    fechaemision: string;
    tipodocumento: string;
    tipoafiliacion: string;
}

export interface RECEPTOR {
    codigopostal: string;
    correoreceptor: string;
    departamento: string;
    municipio: string;
    direccion: string;
    nitreceptor: string;
    nombrereceptor: string;
    idreceptor: string;
    paciente: string;
    codigofactura: string;
    pais: string;
}

export interface ITEMS {
    servicios: any;
    insumos: any;
    productos: any;
    ortopodologia: any;
    servicioscodigo: any;
    insumoscodigo: any;
    productoscodigo: any;
    ortopodologiacodigo: any;
    codigoescenario: number;
}

