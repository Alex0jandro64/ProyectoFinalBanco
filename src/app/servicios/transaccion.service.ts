import { Injectable } from '@angular/core';
import { BaseDatosService } from './base-datos.service';
import { Transaccion } from '../modelo/transaccion';
import { DocumentReference } from '@angular/fire/firestore';

@Injectable({
  providedIn: 'root'
})
export class TransaccionService {

  constructor(private baseDatosService :BaseDatosService) { }

  registrarTransaccion(transaccion: Transaccion): Promise<DocumentReference> {
    return this.baseDatosService.insertar('transacciones', transaccion);
  }
}
