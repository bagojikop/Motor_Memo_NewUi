import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Aknowledgmemnt1Component } from './aknowledgmemnt1.component';

describe('Aknowledgmemnt1Component', () => {
  let component: Aknowledgmemnt1Component;
  let fixture: ComponentFixture<Aknowledgmemnt1Component>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Aknowledgmemnt1Component]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Aknowledgmemnt1Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
