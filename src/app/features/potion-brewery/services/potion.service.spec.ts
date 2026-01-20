import { TestBed } from '@angular/core/testing';
import { PotionService, PotionOrder } from './potion.service';

describe('PotionService', () => {
  let service: PotionService;
  const testPotion: PotionOrder = {
    id: 999,
    potionNumber: 999,
    whoOrdered: 'Тестовый персонаж',
    orderDate: new Date('2026-01-16'),
    readinessDate: new Date('2026-01-18'),
    deliveryAddress: 'г. Тест, ул. Тестовая, д. 1, кв. 7',
    deliveryMethod: 'Сова почтальон',
    paymentMethod: 'Золотая пыльца',
    ingredients: [
      {
        ingredientId: 1,
        ingredientName: 'Агератум',
        count: 3,
        pricePerUnit: 50,
        totalPrice: 150
      }],
    totalCost: 650
  };

  beforeEach(() => {
    localStorage.clear();

    TestBed.configureTestingModule({
      providers: [PotionService]
    });
    service = TestBed.inject(PotionService);
  });

  afterEach(() => {
    localStorage.clear();
  });

  describe('addPotion', () => {
    it('should add potion to list', () => {
      const initialCount = service.getPotions().length;
      service.addPotion(testPotion);

      expect(service.getPotions().length).toBe(initialCount + 1);
      expect(service.getPotions()).toContain(testPotion);
    });
  });

  describe('removePotion', () => {
    it('should remove potion by id', () => {
      service.addPotion(testPotion);
      expect(service.getPotions()).toContain(testPotion);

      service.removePotion(testPotion.id);
      expect(service.getPotions()).not.toContain(testPotion);
    });
  });
});
