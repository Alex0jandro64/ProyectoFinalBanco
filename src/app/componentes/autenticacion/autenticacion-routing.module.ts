import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AutenticacionComponent } from './autenticacion.component';
import { canActivate, redirectUnauthorizedTo } from '@angular/fire/auth-guard';
import { LoginComponent } from './login/login.component';
import { RegistroComponent } from './registro/registro.component';
import { InicioComponent } from './inicio/inicio.component';

const routes: Routes = [
  { path: '', component: AutenticacionComponent, children:[
    { 
      path: 'inicio', 
      component: InicioComponent, 
      ...canActivate(()=> redirectUnauthorizedTo(['/autenticacion/login']))
    },
    { path: 'login', component: LoginComponent},
    { path: 'registrar', component: RegistroComponent },
  ]}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AutenticacionRoutingModule { }