import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListaTransaccionesComponent } from './lista-transacciones.component';

describe('ListaTransaccionesComponent', () => {
  let component: ListaTransaccionesComponent;
  let fixture: ComponentFixture<ListaTransaccionesComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ListaTransaccionesComponent]
    });
    fixture = TestBed.createComponent(ListaTransaccionesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
