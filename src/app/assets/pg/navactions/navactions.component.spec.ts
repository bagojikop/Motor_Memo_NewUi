import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NavactionsComponent } from './navactions.component';

describe('NavactionsComponent', () => {
  let component: NavactionsComponent;
  let fixture: ComponentFixture<NavactionsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ NavactionsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(NavactionsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
