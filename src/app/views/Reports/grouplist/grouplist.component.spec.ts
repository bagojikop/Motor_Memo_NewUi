import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GrouplistComponent } from './grouplist.component';

describe('GrouplistComponent', () => {
  let component: GrouplistComponent;
  let fixture: ComponentFixture<GrouplistComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GrouplistComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(GrouplistComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
