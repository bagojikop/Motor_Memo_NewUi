import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SundryWiseComponent } from './sundry-wise.component';

describe('SundryWiseComponent', () => {
  let component: SundryWiseComponent;
  let fixture: ComponentFixture<SundryWiseComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SundryWiseComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SundryWiseComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
