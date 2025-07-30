import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TransportInvMAsterComponent } from './transport-inv-master.component';

describe('TransportInvMAsterComponent', () => {
  let component: TransportInvMAsterComponent;
  let fixture: ComponentFixture<TransportInvMAsterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TransportInvMAsterComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TransportInvMAsterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
