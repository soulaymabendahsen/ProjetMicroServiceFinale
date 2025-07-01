import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PaymentBackComponent } from './payment-back.component';

describe('PaymentBackComponent', () => {
  let component: PaymentBackComponent;
  let fixture: ComponentFixture<PaymentBackComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [PaymentBackComponent]
    });
    fixture = TestBed.createComponent(PaymentBackComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
