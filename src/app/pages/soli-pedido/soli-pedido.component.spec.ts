import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SoliPedidoComponent } from './soli-pedido.component';

describe('SoliPedidoComponent', () => {
  let component: SoliPedidoComponent;
  let fixture: ComponentFixture<SoliPedidoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SoliPedidoComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SoliPedidoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
