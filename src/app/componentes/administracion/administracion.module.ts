import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AdministracionRoutingModule } from './administracion-routing.module';
import { AdministracionComponent } from './administracion.component';
import { ListaUsuariosComponent } from './lista-usuarios/lista-usuarios.component';


@NgModule({
  declarations: [
    AdministracionComponent,
    ListaUsuariosComponent
  ],
  imports: [
    CommonModule,
    AdministracionRoutingModule
  ]
})
export class AdministracionModule { }
