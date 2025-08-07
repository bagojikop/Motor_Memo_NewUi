import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DuetiesTaxesComponent } from './dueties-taxes.component';

describe('DuetiesTaxesComponent', () => {
  let component: DuetiesTaxesComponent;
  let fixture: ComponentFixture<DuetiesTaxesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DuetiesTaxesComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DuetiesTaxesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
