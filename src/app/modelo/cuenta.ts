import { Transaccion } from "./transaccion";

export interface Cuenta {
    id?: string;
    codigoIban: string;
    saldoCuenta: number;
    usuarioCuenta:string;
    misTransacciones?: Transaccion[];
}