import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Aknowledgmemnt2Component } from './aknowledgmemnt2.component';

describe('Aknowledgmemnt2Component', () => {
  let component: Aknowledgmemnt2Component;
  let fixture: ComponentFixture<Aknowledgmemnt2Component>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Aknowledgmemnt2Component]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Aknowledgmemnt2Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
