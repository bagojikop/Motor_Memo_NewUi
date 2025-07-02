import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ChashbankBookComponent } from './chashbank-book.component';

describe('ChashbankBookComponent', () => {
  let component: ChashbankBookComponent;
  let fixture: ComponentFixture<ChashbankBookComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ChashbankBookComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ChashbankBookComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
