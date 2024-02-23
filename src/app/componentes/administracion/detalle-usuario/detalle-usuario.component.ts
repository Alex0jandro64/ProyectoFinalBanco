import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Usuario } from 'src/app/modelo/usuario';
import { BaseDatosService } from 'src/app/servicios/base-datos.service';
import { NotificacionesService } from 'src/app/servicios/notificaciones.service';

@Component({
  selector: 'app-detalle-usuario',
  templateUrl: './detalle-usuario.component.html',
  styleUrls: ['./detalle-usuario.component.css'],
})
export class DetalleUsuarioComponent {
  formEditarUsuario: FormGroup;
  usuario: Usuario | undefined;
  idUsuario: string | undefined;

  constructor(
    private route: ActivatedRoute,
    private baseDatosServicio: BaseDatosService,
    private notificacionesServicio: NotificacionesService,
    private formBuilder: FormBuilder,
    private router: Router
  ) {
    this.formEditarUsuario = this.formBuilder.group({
      email: ['', Validators.required],
      nombre: ['', Validators.required],
      apellidos: ['', Validators.required],
      telefono: ['', Validators.required],
      rol: ['', Validators.required],
    });
  }

  ngOnInit(): void {
    this.route.params.subscribe((params) => {
      this.idUsuario = params['id'];
    });
    if (this.idUsuario !== undefined) {
      this.baseDatosServicio
        .obtenerPorId('usuarios', this.idUsuario)
        .subscribe((data: Usuario) => {
          this.usuario = data;
          this.formEditarUsuario.setValue({
            email: data.email,
            nombre: data.nombre,
            apellidos: data.apellidos,
            telefono: data.telefono,
            rol: data.rol,
          });
        });
    }
  }

  editarUsuario() {
    const usuario: Usuario = {
      id: this.idUsuario,
      email: this.formEditarUsuario.value.email,
      nombre: this.formEditarUsuario.value.nombre,
      apellidos: this.formEditarUsuario.value.apellidos,
      telefono: this.formEditarUsuario.value.telefono,
      rol: this.formEditarUsuario.value.rol,
    };
    this.baseDatosServicio.actualizar('usuarios', usuario).then(() => {
      this.notificacionesServicio.mostrarNotificacion(
        '¡Datos del usuario actualizados!',
        'El usuario ha sido modificado correctamente',
        'info'
      );
      this.router.navigate(['/administracion/listado-usuarios']);
    });
  }
}