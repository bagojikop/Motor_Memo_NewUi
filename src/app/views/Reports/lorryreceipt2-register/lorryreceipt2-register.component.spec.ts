import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Lorryreceipt2RegisterComponent } from './lorryreceipt2-register.component';

describe('Lorryreceipt2RegisterComponent', () => {
  let component: Lorryreceipt2RegisterComponent;
  let fixture: ComponentFixture<Lorryreceipt2RegisterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Lorryreceipt2RegisterComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Lorryreceipt2RegisterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
