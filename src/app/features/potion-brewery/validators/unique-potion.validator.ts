import { AbstractControl, AsyncValidatorFn, ValidationErrors } from '@angular/forms';
import { Observable, of } from 'rxjs';
import { PotionService } from '../services/potion.service';

export function uniquePotionNumberValidator(potionService: PotionService): AsyncValidatorFn {
  return (control: AbstractControl): Observable<ValidationErrors | null> => {
    if (!control.value) {
      return of(null);
    }

    const existingPotions = potionService.getPotions();
    const isDuplicate = existingPotions.some(potion =>
      potion.potionNumber.toString() === control.value.toString()
    );

    return of(isDuplicate ? { duplicatePotionNumber: true } : null);
  };
}
