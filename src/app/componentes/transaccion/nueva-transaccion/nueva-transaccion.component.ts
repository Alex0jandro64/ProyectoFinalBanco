import { Component } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { take } from 'rxjs';
import { Cuenta } from 'src/app/modelo/cuenta';
import { Transaccion } from 'src/app/modelo/transaccion';
import { Usuario } from 'src/app/modelo/usuario';
import { BaseDatosService } from 'src/app/servicios/base-datos.service';
import { CuentaService } from 'src/app/servicios/cuenta.service';
import { NotificacionesService } from 'src/app/servicios/notificaciones.service';
import { TransaccionService } from 'src/app/servicios/transaccion.service';
import { UsuarioService } from 'src/app/servicios/usuario.service';

@Component({
  selector: 'app-nueva-transaccion',
  templateUrl: './nueva-transaccion.component.html',
  styleUrls: ['./nueva-transaccion.component.css']
})
export class NuevaTransaccionComponent {
  formularioTransaccion: FormGroup;
  emailUsuarioActual: string | undefined | null;
  usuarioActual: Usuario | null = null; // Inicializado como null 
  cuentas: Cuenta[] = []
  constructor(
    private baseDatosService: BaseDatosService,
    private notificacionesServicio: NotificacionesService,
    private route: ActivatedRoute,
    private cuentaService: CuentaService,
    private router: Router,
    private usuarioService: UsuarioService,
    
  ) {
    this.formularioTransaccion = new FormGroup({
      codigoIbanDestino: new FormControl('', Validators.required),
      cantidad: new FormControl('', [Validators.required, Validators.min(0)]),
      codigoIbanRemitente: new FormControl('', Validators.required),
    });
  }

  ngOnInit(): void {
    this.usuarioActual = this.usuarioService.obtenerUsuarioDeLocalStorage();
    this.emailUsuarioActual = this.usuarioActual?.email;
    
    if (this.emailUsuarioActual) {
      // Obtener el usuario actual por su correo electrónico
      this.baseDatosService.obtenerPorFiltro('usuarios', 'email', this.emailUsuarioActual)
        .subscribe((usuarios: Usuario[]) => {
          if (usuarios.length > 0) {
            this.usuarioActual = usuarios[0];
            // Obtener todas las cuentas bancarias asociadas a este usuario
            this.baseDatosService.obtenerPorFiltro('cuentas', 'usuarioCuenta', this.emailUsuarioActual)
              .subscribe((cuentas: any[]) => {
                this.usuarioActual!.misCuentas = cuentas;
                 // Añadiendo el signo de exclamación (!) para decirle a TypeScript que estamos seguros de que usuarioActual no es null o undefined en este punto
              });
          }
        });
        
    }
  }

  onSubmit() {
    if (this.formularioTransaccion.valid) {
      const codigoIbanDestino = this.formularioTransaccion.value.codigoIbanDestino;
      const codigoIbanRemitente = this.formularioTransaccion.value.codigoIbanRemitente;
      const cantidad = this.formularioTransaccion.value.cantidad;
  
      // Verificar que la cuenta destino exista
      this.baseDatosService.obtenerPorFiltro("cuentas", "codigoIban", codigoIbanDestino)
        .pipe(take(1))
        .subscribe((cuentaDestino: Cuenta[]) => {
          if (cuentaDestino.length === 0) {
            this.notificacionesServicio.mostrarNotificacion(
              "La cuenta destino no existe",
              "No puede hacer una transferencia a una cuenta que no existe","error"
            )
            return;
          }
  
          // Verificar que la cuenta destino no sea la misma que la remitente
          if (codigoIbanDestino === codigoIbanRemitente) {
            this.notificacionesServicio.mostrarNotificacion(
              "La cuenta destino no puede ser la misma que la cuenta remitente",
              "No puede hacer una transferencia a la misma cuenta","error"
            )
            return;
          }
  
          // Verificar que la cuenta remitente tenga saldo suficiente
          this.baseDatosService.obtenerPorFiltro("cuentas", "codigoIban", codigoIbanRemitente)
            .pipe(take(1))
            .subscribe((cuentaRemitente: Cuenta[]) => {
              if (cuentaRemitente.length === 0) {
                this.notificacionesServicio.mostrarNotificacion(
                  "La cuenta remitente no existe",
                  "No puede hacer una transferencia de una cuenta que no existe","error"
                )
                return;
              }
  
              if (cuentaRemitente[0].saldoCuenta < cantidad) {
                this.notificacionesServicio.mostrarNotificacion(
                  "La cuenta remitente no tiene saldo suficiente",
                  "No puede hacer una transferencia de saldo insuficiente","error"
                )
                return;
              }
  
              // Realizar la transacción
              const transaccion: Transaccion = {
                codigoIbanDestino: codigoIbanDestino,
                cantidad: cantidad,
                codigoIbanRemitente: codigoIbanRemitente,
                fechaTransaccion: new Date(),
              };
  
              // Registrar la transacción en la base de datos
              this.baseDatosService.insertar('transacciones', transaccion)
                .then(() => {
                  console.log('Transaccion registrada correctamente');
                  this.notificacionesServicio.mostrarNotificacion("Transaccion registrada con éxito", "Su nueva Transaccion ha sido registrada en el sistema", "success");
                  this.router.navigate(['/autenticacion/inicio']);
                })
                .catch((error) => {
                  console.error("Error al registrar la transacción:", error);
                });
  
              // Actualizar el saldo de la cuenta remitente
              cuentaRemitente[0].saldoCuenta -= cantidad;
              this.baseDatosService.actualizar("cuentas", cuentaRemitente[0]);
  
              // Actualizar el saldo de la cuenta destino
              cuentaDestino[0].saldoCuenta += cantidad;
              this.baseDatosService.actualizar("cuentas", cuentaDestino[0]);
            });
        });
    }
  }
 }