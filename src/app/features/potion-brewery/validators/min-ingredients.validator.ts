import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

export function minIngredientsValidator(min: number): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    const value = control.value;
    if (!Array.isArray(value)) {
      return { minIngredients: { requiredLength: min } };
    }

    const uniqueIngredients = new Set(value.map((item: any) => item.ingredient?.id));
    return uniqueIngredients.size >= min ? null : {
      minIngredients: {
        requiredLength: min,
        actualLength: uniqueIngredients.size
      }
    };
  };
}
