import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProfitLossChildComponent } from './profit-loss-child.component';

describe('ProfitLossChildComponent', () => {
  let component: ProfitLossChildComponent;
  let fixture: ComponentFixture<ProfitLossChildComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProfitLossChildComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ProfitLossChildComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
