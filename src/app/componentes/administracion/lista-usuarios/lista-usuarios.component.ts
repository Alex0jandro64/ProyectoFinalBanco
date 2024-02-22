import { Usuario } from 'src/app/modelo/usuario';
import { BaseDatosService } from './../../../servicios/base-datos.service';
import { Component } from '@angular/core';
import { NotificacionesService } from 'src/app/servicios/notificaciones.service';
import { UsuarioService } from 'src/app/servicios/usuario.service';
import { Router } from '@angular/router';
import { map } from 'rxjs';

@Component({
  selector: 'app-lista-usuarios',
  templateUrl: './lista-usuarios.component.html',
  styleUrls: ['./lista-usuarios.component.css'],
})
export class ListaUsuariosComponent {
  
  usuarios: Usuario[] = [];

  constructor(
    private notificacionesServicio: NotificacionesService,
    private baseDatosServicio: BaseDatosService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.obtenerUsuarios();
  }

  obtenerUsuarios() {
    this.baseDatosServicio
      .obtenerTodos('usuarios')
      .pipe(
        map((usuarios: Usuario[]) => {
          return usuarios.map((usuario) => ({
            ...usuario,
            fechaRegistro: this.convertirTimestampADate(usuario.fechaRegistro),
          }));
        })
      )
      .subscribe((usuarios: Usuario[]) => {
        this.usuarios = usuarios;
        console.log(this.usuarios);
      });
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
  

  eliminarUsuario(id: string, email: string) {

    const usuarioAeliminar: Usuario = this.usuarios.find(
      (user) => user.id === id
    )!;

    if(usuarioAeliminar.rol === 'ROLE_ADMIN'){
      this.notificacionesServicio.mostrarNotificacion(
        'Error al eliminar cuenta de usuario',
        'No se puede eliminar un usuario con privilegios de administrador',
        'error'
      )
      return;
    }

    this.notificacionesServicio.confirmarEliminarUsuario(
      id,
      email,
      'usuario',
      'usuarios',
      usuarioAeliminar
    );
  }
  navegarARegistro() {
    this.router.navigate(['/autenticacion/registrar'], { queryParams: { from: 'admin' } });
  }

  buscarUsuarios() {
     const busqueda = (document.querySelector('input[name="busquedaUser"]') as HTMLInputElement).value;
     const usuariosFiltrados = this.usuarios.filter(usuario => usuario.email.includes(busqueda));
     if(usuariosFiltrados.length === 0){
      this.notificacionesServicio.mostrarNotificacion(
        'No se encontraron usuarios',
        'No hay coincidencias en el email de los usuarios con la busqueda realizada',
        'info'
      )
      return;
     }
     this.usuarios = usuariosFiltrados;
  }
}