import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

export interface PotionOrder {
  id: number;
  potionNumber: number;
  whoOrdered: string;
  orderDate: Date;
  readinessDate: Date;
  deliveryAddress: string;
  deliveryMethod: string;
  paymentMethod: string;
  ingredients: Array<{
    ingredientId: number;
    ingredientName: string;
    count: number;
    pricePerUnit: number;
    totalPrice: number;
  }>;
  totalCost: number;
}

@Injectable({
  providedIn: 'root'
})
export class PotionService {
  private readonly STORAGE_KEY = 'potion-app-data';
  private potionsSubject = new BehaviorSubject<PotionOrder[]>([]);
  potions$ = this.potionsSubject.asObservable();

  constructor() {
    const saved = localStorage.getItem(this.STORAGE_KEY);
    if (saved) {
      this.potionsSubject.next(JSON.parse(saved));
    }

    this.potions$.subscribe(potions => {
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(potions));
    });
  }

  addPotion(potion: PotionOrder): void {
    const currentPotions = this.potionsSubject.value;
    this.potionsSubject.next([...currentPotions, potion]);
  }

  removePotion(potionId: number): void {
    const updatedPotions = this.potionsSubject.value.filter(p => p.id !== potionId);
    this.potionsSubject.next(updatedPotions);
  }

  getPotions(): PotionOrder[] {
    return this.potionsSubject.value;
  }
}
