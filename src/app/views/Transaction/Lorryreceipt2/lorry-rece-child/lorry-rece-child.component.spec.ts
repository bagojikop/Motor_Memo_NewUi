import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LorryReceChildComponent } from './lorry-rece-child.component';

describe('LorryReceChildComponent', () => {
  let component: LorryReceChildComponent;
  let fixture: ComponentFixture<LorryReceChildComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LorryReceChildComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LorryReceChildComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
