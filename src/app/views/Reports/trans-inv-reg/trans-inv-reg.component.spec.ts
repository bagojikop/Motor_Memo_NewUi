import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TransInvRegComponent } from './trans-inv-reg.component';

describe('TransInvRegComponent', () => {
  let component: TransInvRegComponent;
  let fixture: ComponentFixture<TransInvRegComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TransInvRegComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TransInvRegComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
