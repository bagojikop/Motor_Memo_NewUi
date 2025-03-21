import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NgbselectComponent } from './ngselect.component';

describe('NgbselectComponent', () => {
  let component: NgbselectComponent;
  let fixture: ComponentFixture<NgbselectComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ NgbselectComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(NgbselectComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
