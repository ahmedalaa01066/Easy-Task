import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditHierarachyComponent } from './edit-hierarachy.component';

describe('EditHierarachyComponent', () => {
  let component: EditHierarachyComponent;
  let fixture: ComponentFixture<EditHierarachyComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [EditHierarachyComponent]
    });
    fixture = TestBed.createComponent(EditHierarachyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
