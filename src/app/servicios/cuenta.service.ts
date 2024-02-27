import { Injectable } from '@angular/core';
import { Auth } from '@angular/fire/auth';
import { BaseDatosService } from './base-datos.service';
import { Cuenta } from '../modelo/cuenta';

@Injectable({
  providedIn: 'root'
})
export class CuentaService {

  constructor(private auth: Auth, private baseDatosServicio: BaseDatosService) { }

  obtenerCuentaFirebase(iban: string){
    return this.baseDatosServicio.obtenerPorFiltro("cuentas", "codigoIban", iban);
  }


}
