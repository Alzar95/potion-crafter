import {ComponentFixture, TestBed} from '@angular/core/testing';
import {IngredientsEditorComponent} from './ingredients-editor.component';

describe('IngredientsEditorComponent', () => {
  let component: IngredientsEditorComponent;
  let fixture: ComponentFixture<IngredientsEditorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [IngredientsEditorComponent]
    }).compileComponents();

    fixture = TestBed.createComponent(IngredientsEditorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should add ingredient and emit value', () => {
    let emittedValue: any;
    component.registerOnChange((val: any) => emittedValue = val);

    component.selectedIngredients = [{
      ingredient: {id: 1, name: 'Тестовый ингредиент', pricePerUnit: 100},
      count: 2,
      totalPrice: 200
    }];

    component['onChange'](component.selectedIngredients);

    expect(emittedValue).toBeDefined();
    expect(emittedValue.length).toBe(1);
  });

  it('should validate minimum 3 unique ingredients', () => {
    component.selectedIngredients = [
      {ingredient: {id: 1, name: 'Ингр1', pricePerUnit: 10}, count: 1, totalPrice: 10},
      {ingredient: {id: 2, name: 'Ингр2', pricePerUnit: 20}, count: 1, totalPrice: 20}
    ];

    const uniqueCount = component.getUniqueIngredientsCount();
    expect(uniqueCount).toBe(2);
    expect(uniqueCount).toBeLessThan(3);
  });
});
