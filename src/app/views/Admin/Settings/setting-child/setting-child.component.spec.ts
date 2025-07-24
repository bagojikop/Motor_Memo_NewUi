import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SettingChildComponent } from './setting-child.component';

describe('SettingChildComponent', () => {
  let component: SettingChildComponent;
  let fixture: ComponentFixture<SettingChildComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SettingChildComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SettingChildComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
