import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { map } from 'rxjs';
import { Transaccion } from 'src/app/modelo/transaccion';
import { Usuario } from 'src/app/modelo/usuario';
import { BaseDatosService } from 'src/app/servicios/base-datos.service';
import { NotificacionesService } from 'src/app/servicios/notificaciones.service';
import { UsuarioService } from 'src/app/servicios/usuario.service';

@Component({
  selector: 'app-lista-transacciones',
  templateUrl: './lista-transacciones.component.html',
  styleUrls: ['./lista-transacciones.component.css']
})
export class ListaTransaccionesComponent {
 codigoIban: string | undefined | null;
  transacciones: Transaccion[] =[] ;
  emailUsuarioActual: string | undefined | null;
  usuarioActual: Usuario | null = null; // Inicializado como null

  constructor(
    private notificacionesServicio: NotificacionesService,
    private baseDatosServicio: BaseDatosService,
    private router: Router,
    private usuarioServicio: UsuarioService,
  ) {}

  ngOnInit(): void {
    this.usuarioActual = this.usuarioServicio.obtenerUsuarioDeLocalStorage();
    this.emailUsuarioActual = this.usuarioActual?.email;

    console.log(this.emailUsuarioActual);
    if (this.emailUsuarioActual) {
        // Obtener el usuario actual por su correo electrónico
        this.baseDatosServicio.obtenerPorFiltro('usuarios', 'email', this.emailUsuarioActual)
            .subscribe((usuarios: Usuario[]) => {
                if (usuarios.length > 0) {
                    this.usuarioActual = usuarios[0];
                    // Obtener todas las cuentas bancarias asociadas a este usuario
                    this.baseDatosServicio.obtenerPorFiltro('cuentas', 'usuarioCuenta', this.emailUsuarioActual)
                        .subscribe((cuentas: any[]) => {
                            this.usuarioActual!.misCuentas = cuentas;

                            // Ahora, para cada cuenta, obtenemos las transacciones en las que la cuenta es la remitente o la destinataria
                            for (const cuenta of this.usuarioActual!.misCuentas) {
                                this.baseDatosServicio.obtenerPorFiltro('transacciones', 'codigoIbanDestino', cuenta.codigoIban)
                                    .subscribe((transaccionesDestino: Transaccion[]) => {
                                        cuenta.misTransacciones = transaccionesDestino;

                                        this.baseDatosServicio.obtenerPorFiltro('transacciones', 'codigoIbanRemitente', cuenta.codigoIban)
                                            .subscribe((transaccionesRemitente: Transaccion[]) => {
                                                if (cuenta.misTransacciones) {
                                                    cuenta.misTransacciones = cuenta.misTransacciones.concat(transaccionesRemitente);
                                                } else {
                                                    cuenta.misTransacciones = transaccionesRemitente;
                                                }
                                                cuenta.misTransacciones.forEach(transaccion => {
                                                  transaccion.fechaTransaccion = this.convertirTimestampADate(transaccion.fechaTransaccion);
                                              });
                                                // Añadir las transacciones de esta cuenta a this.transacciones
                                                if (cuenta.misTransacciones) {
                                                    this.transacciones = this.transacciones.concat(cuenta.misTransacciones);
                                                }
                                            });
                                    });
                            }
                            this.codigoIban=this.usuarioActual!.misCuentas[0].codigoIban;
                            console.log(this.codigoIban);
                        });
                }
            });
    }
}


  private convertirTimestampADate(timestamp: any): Date {
    if (timestamp instanceof Date) {
      return timestamp; // Si ya es un objeto Date, devolverlo tal cual
    } else if (timestamp && typeof timestamp.toDate === 'function') {
      return timestamp.toDate(); // Si es un objeto Timestamp, convertirlo a Date
    } else if (timestamp && typeof timestamp.seconds === 'number') {
      return new Date(timestamp.seconds * 1000); // Si es un objeto con la propiedad 'seconds', asumir que es un objeto Timestamp y convertirlo a Date
    } else {
      return new Date(); // Si no se puede convertir, devolver la fecha actual como fallback
    }
  }

  navegarARegistro() {
    this.router.navigate(['/autenticacion/registrar'], { queryParams: { from: 'admin' } });
  }

}