import { Component } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { NotificacionesService } from 'src/app/servicios/notificaciones.service';
import { UsuarioService } from 'src/app/servicios/usuario.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {

  formularioLogin: FormGroup;

  constructor(
    private usuarioService: UsuarioService,
    private router: Router,
    private notificacionesServicio :NotificacionesService
  ) {
    this.formularioLogin = new FormGroup({
      email: new FormControl(),
      password: new FormControl()
    })
  }

  ngOnInit(): void {
  }

  onSubmit() {
    this.usuarioService.login(this.formularioLogin.value)
      .then(response => {
        console.log(response);
        this.notificacionesServicio.mostrarNotificacion('Inicio de sesión correcto', 'Bienvenido a AlceBank', 'success');
        this.router.navigate(['/autenticacion/inicio']);
      })
      .catch(error => {
        if(error.code === 'auth/user-not-found') {
          this.notificacionesServicio.mostrarNotificacion('Credenciales incorrectas', 'El correo electrónico o la contraseña introducidas son incorrectas', 'error');
        } else if(error.code === 'auth/invalid-credential'){
          this.notificacionesServicio.mostrarNotificacion('Credenciales incorrectas', 'El correo electrónico o la contraseña introducidas son incorrectas', 'error');
        } else if(error.code === 'auth/invalid-email') {
          this.notificacionesServicio.mostrarNotificacion('El email introducido no es válido', 'Revise la información proporcionada', 'error');
        } else if(error.code === 'auth/network-request-failed'){
          this.notificacionesServicio.mostrarNotificacion('Error de red', 'No se ha podido conectar con el servidor, intentalo de nuevo más tarde', 'error');
        } else {  
          console.log('Error de Firebase:', error);
        }
      });
  }


}
