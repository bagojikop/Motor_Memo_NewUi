import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BiltychildComponent } from './biltychild.component';

describe('BiltychildComponent', () => {
  let component: BiltychildComponent;
  let fixture: ComponentFixture<BiltychildComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BiltychildComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BiltychildComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
