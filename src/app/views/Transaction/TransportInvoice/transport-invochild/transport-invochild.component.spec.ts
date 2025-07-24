import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TransportInvochildComponent } from './transport-invochild.component';

describe('TransportInvochildComponent', () => {
  let component: TransportInvochildComponent;
  let fixture: ComponentFixture<TransportInvochildComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TransportInvochildComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TransportInvochildComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
