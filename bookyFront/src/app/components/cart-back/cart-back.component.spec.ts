import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CartBackComponent } from './cart-back.component';

describe('CartBackComponent', () => {
  let component: CartBackComponent;
  let fixture: ComponentFixture<CartBackComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [CartBackComponent]
    });
    fixture = TestBed.createComponent(CartBackComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
