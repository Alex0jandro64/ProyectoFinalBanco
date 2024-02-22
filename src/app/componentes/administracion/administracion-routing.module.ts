import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AdministracionComponent } from './administracion.component';
import { ListaUsuariosComponent } from './lista-usuarios/lista-usuarios.component';
import { administracionGuard } from 'src/app/guards/administracion.guard';

const routes: Routes = [
  {
    path: '',
    component: AdministracionComponent,
    children: [
      { path: 'listado-usuarios', component: ListaUsuariosComponent, canActivate: [administracionGuard] },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AdministracionRoutingModule {}