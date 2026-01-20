import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { PotionFormComponent } from './potion-form.component';

describe('PotionFormComponent', () => {
  let component: PotionFormComponent;
  let fixture: ComponentFixture<PotionFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PotionFormComponent, ReactiveFormsModule]
    }).compileComponents();

    fixture = TestBed.createComponent(PotionFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should mark form invalid when required fields empty', () => {
    expect(component.potionForm.valid).toBeFalsy();

    expect(component.potionForm.get('potionNumber')?.errors?.['required']).toBeTruthy();
    expect(component.potionForm.get('whoOrdered')?.errors?.['required']).toBeTruthy();
    expect(component.potionForm.get('orderDate')?.errors?.['required']).toBeTruthy();
    expect(component.potionForm.get('readinessDate')?.errors?.['required']).toBeTruthy();
    expect(component.potionForm.get('deliveryAddress')?.errors?.['required']).toBeTruthy();
    expect(component.potionForm.get('deliveryMethod')?.errors?.['required']).toBeTruthy();
    expect(component.potionForm.get('paymentMethod')?.errors?.['required']).toBeTruthy();
    expect(component.potionForm.get('selectedIngredients')?.errors?.['required']).toBeTruthy();
  });

  it('should validate readinessDate is after orderDate', () => {
    component.potionForm.patchValue({
      orderDate: new Date('2026-01-18').toISOString(),
      readinessDate: new Date('2026-01-16').toISOString()
    });
  });
});
