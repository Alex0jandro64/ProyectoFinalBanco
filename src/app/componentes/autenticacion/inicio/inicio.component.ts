import { Component, OnInit } from '@angular/core';
import { Usuario } from 'src/app/modelo/usuario';
import { BaseDatosService } from 'src/app/servicios/base-datos.service';
import { UsuarioService } from 'src/app/servicios/usuario.service';

@Component({
  selector: 'app-inicio',
  templateUrl: './inicio.component.html',
  styleUrls: ['./inicio.component.css']
})
export class InicioComponent implements OnInit {
  emailUsuarioActual: string | undefined | null;
  usuarioActual: Usuario | null = null; // Inicializado como null 

  constructor(
    private usuarioServicio: UsuarioService,
    private baseDatosServicio: BaseDatosService
  ) {
    localStorage.clear();
    this.usuarioServicio.guardarUsuarioEnLocalStorage();
  }

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
}