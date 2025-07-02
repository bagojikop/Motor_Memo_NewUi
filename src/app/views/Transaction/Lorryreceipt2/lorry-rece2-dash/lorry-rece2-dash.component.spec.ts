import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LorryRece2DashComponent } from './lorry-rece2-dash.component';

describe('LorryRece2DashComponent', () => {
  let component: LorryRece2DashComponent;
  let fixture: ComponentFixture<LorryRece2DashComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LorryRece2DashComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LorryRece2DashComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
