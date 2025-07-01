import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LayoutUpdateAddComponent } from './layout-update-add.component';

describe('LayoutUpdateAddComponent', () => {
  let component: LayoutUpdateAddComponent;
  let fixture: ComponentFixture<LayoutUpdateAddComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [LayoutUpdateAddComponent]
    });
    fixture = TestBed.createComponent(LayoutUpdateAddComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
