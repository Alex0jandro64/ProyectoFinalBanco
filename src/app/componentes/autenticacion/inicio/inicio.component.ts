import { Component } from '@angular/core';
import { Usuario } from 'src/app/modelo/usuario';
import { BaseDatosService } from 'src/app/servicios/base-datos.service';
import { UsuarioService } from 'src/app/servicios/usuario.service';

@Component({
  selector: 'app-inicio',
  templateUrl: './inicio.component.html',
  styleUrls: ['./inicio.component.css']
})
export class InicioComponent {
  emailUsuarioActual: string | undefined | null;
  usuarioActual: Usuario | undefined;

  constructor(
    private usuarioServicio: UsuarioService,
    private baseDatosServicio: BaseDatosService
  ) {
    localStorage.clear();
    this.usuarioServicio.guardarUsuarioEnLocalStorage();
  }

  ngOnInit(): void {

    this.emailUsuarioActual = this.usuarioServicio.obtenerUsuarioActual()?.email;
    
    this.baseDatosServicio
      .obtenerPorFiltro('usuarios', 'email', this.emailUsuarioActual)
      .subscribe((data) => {
        this.usuarioActual = data[0];
      });
  }
}