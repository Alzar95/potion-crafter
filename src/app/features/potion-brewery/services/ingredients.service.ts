import { Injectable, signal } from '@angular/core';
import ingredientsJSON from '../../../../assets/data/ingredients.json';

export interface IngredientsInterface {
  id: number;
  name: string;
  pricePerUnit: number;
}

@Injectable({
  providedIn: 'root'
})
export class IngredientsService {
  private ingredients = signal<IngredientsInterface[]>(ingredientsJSON.ingredients);

  constructor() { }

  getData() {
    return this.ingredients.asReadonly();
  }
}
