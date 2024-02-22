import { Injectable } from '@angular/core';
import { Auth, createUserWithEmailAndPassword, deleteUser, sendPasswordResetEmail, signInWithEmailAndPassword, signOut } from '@angular/fire/auth';
import { Usuario } from '../modelo/usuario';
import { BaseDatosService } from './base-datos.service';


@Injectable({
  providedIn: 'root'
})
export class UsuarioService {

  constructor(private auth: Auth, private baseDatosServicio: BaseDatosService) { }

  registrar(usuario: Usuario){
    return createUserWithEmailAndPassword(this.auth, usuario.email, usuario.password!);
  }

  async login(usuario: Usuario){
    return signInWithEmailAndPassword(this.auth, usuario.email, usuario.password!);
  }

  logout(){
    localStorage.clear();
    return signOut(this.auth);
  }

  obtenerUsuarioActual(){
    return this.auth.currentUser;
  }

  obtenerUsuarioFirebase(email: string){
    return this.baseDatosServicio.obtenerPorFiltro("usuarios", "email", email);
  }
  get isAdmin(): boolean {
    const id_acceso = localStorage.getItem('rol');
    if(id_acceso =="ROLE_ADMIN"){
    return true; // Devuelve true si existe un valor en userID
  }else{
    return false;
  }
}
  async borrarUsuario(usuario: Usuario){
    try {
      const response = await this.login(usuario);
      const user = response.user; 
      if (user) {
        await deleteUser(user); 
        console.log("Usuario eliminado correctamente de Auth firebase.");
      }
    } catch (error) {
      console.error("Error al eliminar usuario de de Auth firebase:", error);
    }
  }

  guardarUsuarioEnLocalStorage(){

    localStorage.clear();
    const userEmail = this.obtenerUsuarioActual()?.email;
    let usuario: Usuario;

    this.baseDatosServicio.obtenerPorFiltro("usuarios", "email", userEmail).subscribe(
      (data: Usuario[]) => {
        if(data.length > 0) {
          usuario = data[0];
          console.log('Usuario encontrado:', usuario);
          localStorage.setItem('usuarioActual', JSON.stringify(usuario));
        }
      }
    )

  }

  obtenerUsuarioDeLocalStorage(){
    const usuarioActual = localStorage.getItem('usuarioActual');
    console.log('Usuario actual:', usuarioActual);
    return usuarioActual ? JSON.parse(usuarioActual) : null;
  }

  actualizarUsuarioEnLocalStorage(usuario: Usuario){
    localStorage.setItem('usuarioActual', JSON.stringify(usuario)); 
  }
  eliminarUsuarioDeLocalStorage(){
    localStorage.removeItem('usuarioActual');
    localStorage.clear();
  }

  actualizarUsuario(usuario: Usuario){
    return this.baseDatosServicio.actualizar('usuarios', usuario); 
  }

  enviarCorreoRestablecimiento(email: string): Promise<void> {
    return sendPasswordResetEmail(this.auth, email);
  }
  
  
}