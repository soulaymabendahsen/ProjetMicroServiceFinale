import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PageBooksComponent } from './page-books.component';

describe('PageBooksComponent', () => {
  let component: PageBooksComponent;
  let fixture: ComponentFixture<PageBooksComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [PageBooksComponent]
    });
    fixture = TestBed.createComponent(PageBooksComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
