import {Component, inject, ViewChild} from '@angular/core';
import {toSignal} from '@angular/core/rxjs-interop';
import {FormsModule, FormBuilder, ReactiveFormsModule, Validators} from '@angular/forms';
import {BreakpointObserver} from '@angular/cdk/layout';
import {map} from 'rxjs';
import {MessageService} from 'primeng/api';
import {ButtonModule} from 'primeng/button';
import {DatePickerModule} from 'primeng/datepicker';
import {DialogModule} from 'primeng/dialog';
import {FloatLabel} from 'primeng/floatlabel';
import {IftaLabelModule} from 'primeng/iftalabel';
import {InputTextModule} from 'primeng/inputtext';
import {Select} from 'primeng/select';
import {Toast} from 'primeng/toast';
import {minIngredientsValidator} from '../../validators/min-ingredients.validator';
import {uniquePotionNumberValidator} from '../../validators/unique-potion.validator';
import {PotionService, PotionOrder} from '../../services/potion.service';
import {IngredientsEditorComponent} from '../ingredients-editor/ingredients-editor.component';

@Component({
  selector: 'app-potion-form',
  imports: [Toast, FormsModule, IftaLabelModule, Select, ButtonModule, InputTextModule, DialogModule, FloatLabel, DatePickerModule, IngredientsEditorComponent, ReactiveFormsModule],
  templateUrl: './potion-form.component.html',
  styleUrl: './potion-form.component.scss',
  standalone: true,
  providers: [MessageService]
})
export class PotionFormComponent {
  @ViewChild(IngredientsEditorComponent) ingredientsEditor!: IngredientsEditorComponent;
  private potionService = inject(PotionService);
  private messageService = inject(MessageService);
  private breakpointObserver = inject(BreakpointObserver);
  isMobile = toSignal(
    this.breakpointObserver
      .observe('(max-width: 767px)')
      .pipe(map(result => result.matches)),
    {initialValue: false}
  );
  visible: boolean = false;
  arrayDeliveryMethod: string[] = ['Телепорт', 'Сова почтальон', 'Фея курьер'];
  arrayPaymentMethod: string[] = ['Волшебная наличка', 'Золотая пыльца', 'Карта Альвхейма'];

  private formBuilder = inject(FormBuilder);

  potionForm = this.formBuilder.group({
    potionNumber: [null as number | null, [Validators.required], [uniquePotionNumberValidator(this.potionService)]],
    whoOrdered: ['', Validators.required],
    orderDate: ['', Validators.required],
    readinessDate: ['', Validators.required],
    deliveryAddress: ['', Validators.required],
    deliveryMethod: ['', Validators.required],
    paymentMethod: ['', Validators.required],
    selectedIngredients: [[], [Validators.required, minIngredientsValidator(3)]],
  });

  private calculateTotalCost(ingredients: any[]): number {
    return ingredients.reduce((sum, item) => sum + item.totalPrice, 0);
  }

  showDialog() {
    this.visible = true;
  }

  brewAPotion() {
    if (this.potionForm.valid) {
      const formValue = this.potionForm.value;

      const newPotion: PotionOrder = {
        id: Date.now(),
        potionNumber: formValue.potionNumber!,
        whoOrdered: formValue.whoOrdered!,
        orderDate: new Date(formValue.orderDate!),
        readinessDate: new Date(formValue.readinessDate!),
        deliveryAddress: formValue.deliveryAddress!,
        deliveryMethod: formValue.deliveryMethod!,
        paymentMethod: formValue.paymentMethod!,
        ingredients: formValue.selectedIngredients || [],
        totalCost: this.calculateTotalCost(formValue.selectedIngredients || [])
      };

      this.potionService.addPotion(newPotion);

      this.potionForm.reset();
      this.ingredientsEditor.clear();
      this.visible = false;

      this.messageService.add({
        severity: 'success',
        summary: 'Зелье успешно добавлено!',
        detail: 'Зелье успешно добавлено!'
      });
    }
  }
}
