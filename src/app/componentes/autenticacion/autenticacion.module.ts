import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AutenticacionRoutingModule } from './autenticacion-routing.module';
import { AutenticacionComponent } from './autenticacion.component';
import { LoginComponent } from './login/login.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RegistroComponent } from './registro/registro.component';
import { InicioComponent } from './inicio/inicio.component';
import { RecuperarPasswordComponent } from './recuperar-password/recuperar-password.component';


@NgModule({
  declarations: [
    AutenticacionComponent,
    LoginComponent,
    RegistroComponent,
    InicioComponent,
    RecuperarPasswordComponent,
    
  ],
  imports: [
    CommonModule,
    AutenticacionRoutingModule,
    ReactiveFormsModule,
    FormsModule
  ]
})
export class AutenticacionModule { }