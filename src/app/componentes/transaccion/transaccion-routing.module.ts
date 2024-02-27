import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { TransaccionComponent } from './transaccion.component';
import { AutenticacionComponent } from '../autenticacion/autenticacion.component';
import { NuevaTransaccionComponent } from './nueva-transaccion/nueva-transaccion.component';
import { ListaTransaccionesComponent } from './lista-transacciones/lista-transacciones.component';

const routes: Routes = [
  { path: '', component: AutenticacionComponent, children:[
    { path: 'nueva-transaccion', component: NuevaTransaccionComponent},
    { path: 'lista-transacciones', component: ListaTransaccionesComponent},
  ]}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class TransaccionRoutingModule { }
