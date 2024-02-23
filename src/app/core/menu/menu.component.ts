import { Component, OnInit } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { Usuario } from 'src/app/modelo/usuario';
import { BaseDatosService } from 'src/app/servicios/base-datos.service';
import { NotificacionesService } from 'src/app/servicios/notificaciones.service';
import { UsuarioService } from 'src/app/servicios/usuario.service';

@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.css']
})
export class MenuComponent {
  
  // Variable para indicar si el usuario es administrador
  esAdmin: boolean = false;
  emailUsuarioActual: string | undefined | null;
  usuarioActual: Usuario | null = null; // Inicializado como null

  // Constructor
  constructor(
    private notificacionesServicio :NotificacionesService,
    private authService: UsuarioService,
    private baseDatosServicio: BaseDatosService,
    private usuarioServicio: UsuarioService,
  ) { }

  /**
   * Método que se inicia al iniciar el componente
   */
  ngOnInit(): void {
    this.emailUsuarioActual = this.usuarioServicio.obtenerUsuarioActual()?.email;
    
    if (this.emailUsuarioActual) {
      // Obtener el usuario actual por su correo electrónico
      this.baseDatosServicio.obtenerPorFiltro('usuarios', 'email', this.emailUsuarioActual)
        .subscribe((usuarios: Usuario[]) => {
          if (usuarios.length > 0) {
            this.usuarioActual = usuarios[0];
            // Obtener todas las cuentas bancarias asociadas a este usuario
            this.baseDatosServicio.obtenerPorFiltro('cuentas', 'usuarioCuenta', this.emailUsuarioActual)
              .subscribe((cuentas: any[]) => {
                this.usuarioActual!.misCuentas = cuentas; // Añadiendo el signo de exclamación (!) para decirle a TypeScript que estamos seguros de que usuarioActual no es null o undefined en este punto
              });
          }
        });
    }
  }
  onClick() {
    this.notificacionesServicio.confirmarLogout();
  }

}