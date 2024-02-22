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


  // Constructor
  constructor(
    private notificacionesServicio :NotificacionesService,
    private authService: UsuarioService,
    private dbs: BaseDatosService
  ) { }

  /**
   * Método que se inicia al iniciar el componente
   */
  ngOnInit() {
    // Comprobamos si el usuario es administrador o no
    this.esAdmin = this.authService.isAdmin;

  }
  onClick() {
    this.notificacionesServicio.confirmarLogout();
  }

}