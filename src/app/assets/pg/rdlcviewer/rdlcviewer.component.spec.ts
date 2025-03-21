import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RdlcviewerComponent } from './rdlcviewer.component';

describe('RdlcviewerComponent', () => {
  let component: RdlcviewerComponent;
  let fixture: ComponentFixture<RdlcviewerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RdlcviewerComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RdlcviewerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
