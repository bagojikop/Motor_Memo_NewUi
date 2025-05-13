import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MotormemoRegisterComponent } from './motormemo-register.component';

describe('MotormemoRegisterComponent', () => {
  let component: MotormemoRegisterComponent;
  let fixture: ComponentFixture<MotormemoRegisterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MotormemoRegisterComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MotormemoRegisterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
