export interface Transaccion {
    id?: string;
    codigoIbanDestino: string;
    codigoIbanRemitente: string;
    cantidad: number;
    fechaTransaccion?: Date;

}