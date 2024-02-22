import { TestBed } from '@angular/core/testing';
import { CanActivateFn } from '@angular/router';

import { administracionGuard } from './administracion.guard';

describe('administracionGuard', () => {
  const executeGuard: CanActivateFn = (...guardParameters) => 
      TestBed.runInInjectionContext(() => administracionGuard(...guardParameters));

  beforeEach(() => {
    TestBed.configureTestingModule({});
  });

  it('should be created', () => {
    expect(executeGuard).toBeTruthy();
  });
});
