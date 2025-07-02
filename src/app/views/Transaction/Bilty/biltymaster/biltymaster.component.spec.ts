import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BiltymasterComponent } from './biltymaster.component';

describe('BiltymasterComponent', () => {
  let component: BiltymasterComponent;
  let fixture: ComponentFixture<BiltymasterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BiltymasterComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BiltymasterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
