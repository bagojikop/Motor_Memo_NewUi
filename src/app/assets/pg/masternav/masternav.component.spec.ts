import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MasternavComponent } from './masternav.component';

describe('MasternavComponent', () => {
  let component: MasternavComponent;
  let fixture: ComponentFixture<MasternavComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MasternavComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MasternavComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
