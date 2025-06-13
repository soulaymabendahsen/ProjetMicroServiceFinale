import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReclamationAddComponent } from './reclamation-add.component';

describe('ReclamationAddComponent', () => {
  let component: ReclamationAddComponent;
  let fixture: ComponentFixture<ReclamationAddComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ReclamationAddComponent]
    });
    fixture = TestBed.createComponent(ReclamationAddComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
