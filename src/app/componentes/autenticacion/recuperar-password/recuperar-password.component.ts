import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { NotificacionesService } from 'src/app/servicios/notificaciones.service';
import { UsuarioService } from 'src/app/servicios/usuario.service';

@Component({
  selector: 'app-recuperar-password',
  templateUrl: './recuperar-password.component.html',
  styleUrls: ['./recuperar-password.component.css'],
})
export class RecuperarPasswordComponent {
  email: string = '';

  constructor(
    private usuarioServicio: UsuarioService,
    private notificacionServicio: NotificacionesService,
    private router: Router
  ) {}

  enviarSolicitudRecuperacion() {
    this.usuarioServicio
      .enviarCorreoRestablecimiento(this.email)
      .then(() => {
        console.log(
          'Se ha enviado la solicitud de recuperación de contraseña correctamente.'
        );
        this.notificacionServicio.mostrarNotificacion(
          'Email de recuperación de contraseña enviado correctamente.','Revise su bandeja de entrada y siga las instrucciones','info'
        )
        this.router.navigate(['/autenticacion/login']);
      })
      .catch((error) => {
        console.error(
          'Error al enviar la solicitud de recuperación de contraseña:',
          error
        );
        this.notificacionServicio.mostrarNotificacion(
          'Error al enviar la solicitud de recuperación de contraseña. Intente de nuevo mas tarde. Error: ' + error,'','error'
        )
      });
  }
}