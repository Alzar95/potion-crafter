import {Component, forwardRef, inject, Signal, computed} from '@angular/core';
import {toSignal} from '@angular/core/rxjs-interop';
import {CurrencyPipe} from '@angular/common';
import {
  ControlValueAccessor,
  NG_VALUE_ACCESSOR,
  FormControl,
  FormsModule,
  ReactiveFormsModule,
  Validators,
  FormGroup
} from '@angular/forms';
import {BreakpointObserver} from '@angular/cdk/layout';
import {map} from 'rxjs';
import {Button} from 'primeng/button';
import {DataView} from 'primeng/dataview';
import {FloatLabel} from 'primeng/floatlabel';
import {InputTextModule} from 'primeng/inputtext';
import {OrderListModule} from 'primeng/orderlist';
import {Select} from 'primeng/select';
import {TableModule} from 'primeng/table';
import {Tooltip} from 'primeng/tooltip';
import {IngredientsService, IngredientsInterface} from '../../services/ingredients.service';

@Component({
  selector: 'app-ingredients-editor',
  imports: [Tooltip, TableModule, CurrencyPipe, Button, FloatLabel, InputTextModule, ReactiveFormsModule, Select, FormsModule, OrderListModule, DataView],
  templateUrl: './ingredients-editor.component.html',
  styleUrl: './ingredients-editor.component.scss',
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => IngredientsEditorComponent),
      multi: true
    }
  ],
  standalone: true
})
export class IngredientsEditorComponent implements ControlValueAccessor {
  private breakpointObserver = inject(BreakpointObserver);
  ingredientsService = inject(IngredientsService);
  ingredientsSignal = this.ingredientsService.getData();
  isMobile = toSignal(
    this.breakpointObserver
      .observe('(max-width: 767px)')
      .pipe(map(result => result.matches)),
    {initialValue: false}
  );
  selectedIngredients: Array<{
    ingredient: IngredientsInterface | null;
    count: number;
    totalPrice: number;
  }> = [];

  ingredientsForm = new FormGroup({
    ingredientsControl: new FormControl(null, Validators.required),
    count: new FormControl(1, [Validators.required, Validators.min(1)]),
  });

  selectedIngredientIdSignal: Signal<number | null> = toSignal(
    this.ingredientsForm.controls.ingredientsControl.valueChanges,
    {initialValue: null}
  );
  selectedIngredientSignal = computed(() => {
    const id = this.selectedIngredientIdSignal();
    if (!id) return null;
    return this.ingredientsSignal().find(ing => ing.id === id) || null;
  });
  currentPricePerUnit = computed(() => this.selectedIngredientSignal()?.pricePerUnit || 0);

  addIngredient() {
    const ingredient = this.selectedIngredientSignal();
    const count = this.ingredientsForm.controls.count.value;

    if (!ingredient || !count) return;

    const existingIndex = this.selectedIngredients.findIndex(
      item => item.ingredient?.id === ingredient.id
    );

    if (existingIndex > -1) {
      const existing = this.selectedIngredients[existingIndex];
      const newCount = existing.count + count;
      this.selectedIngredients[existingIndex] = {
        ingredient,
        count: newCount,
        totalPrice: ingredient.pricePerUnit * newCount
      };
    } else {
      this.selectedIngredients.push({
        ingredient,
        count,
        totalPrice: ingredient.pricePerUnit * count
      });
    }

    this.ingredientsForm.reset({count: 1});
    this.onChange(this.selectedIngredients);
  }

  removeIngredient(index: number) {
    this.selectedIngredients.splice(index, 1);
    this.onChange(this.selectedIngredients);
  }

  getTotalPrice(): number {
    return this.selectedIngredients.reduce((sum, item) => sum + item.totalPrice, 0);
  }

  getUniqueIngredientsCount(): number {
    const uniqueIds = new Set(this.selectedIngredients.map(item => item.ingredient?.id));
    return uniqueIds.size;
  }

  clear(): void {
    this.selectedIngredients = [];
    this.ingredientsForm.reset({count: 1});
    this.onChange([]);
    this.onTouched();
  }

  private onChange = (val: any) => {
  };
  private onTouched = () => {
  };

  writeValue(value: any): void {
    if (value && Array.isArray(value)) {
      this.selectedIngredients = value;
    }
  }

  registerOnChange(fn: any): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: any): void {
    this.onTouched = fn;
  }
}
