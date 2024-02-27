import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { TransaccionRoutingModule } from './transaccion-routing.module';
import { TransaccionComponent } from './transaccion.component';
import { ListaTransaccionesComponent } from './lista-transacciones/lista-transacciones.component';
import { NuevaTransaccionComponent } from './nueva-transaccion/nueva-transaccion.component';


@NgModule({
  declarations: [
    TransaccionComponent,
    ListaTransaccionesComponent,
    NuevaTransaccionComponent,
  ],
  imports: [
    CommonModule,
    FormsModule,
    TransaccionRoutingModule,
    ReactiveFormsModule,
    
  ]
})
export class TransaccionModule { }
