import {Component, inject, OnInit, OnDestroy} from '@angular/core';
import {CommonModule} from '@angular/common';
import {Subscription} from 'rxjs';
import {ConfirmationService, MessageService} from 'primeng/api';
import {Button} from 'primeng/button';
import {ConfirmDialogModule} from 'primeng/confirmdialog';
import {DataView} from 'primeng/dataview';
import {TableModule} from 'primeng/table';
import {Toast} from 'primeng/toast';
import {Tooltip} from 'primeng/tooltip';
import {PotionService, PotionOrder} from '../../services/potion.service';

@Component({
  selector: 'app-potion-list',
  standalone: true,
  imports: [CommonModule, TableModule, Button, Toast, ConfirmDialogModule, DataView, Tooltip],
  providers: [ConfirmationService, MessageService],
  templateUrl: './potion-list.component.html',
  styleUrl: './potion-list.component.scss',
})
export class PotionListComponent implements OnInit, OnDestroy {
  private potionService = inject(PotionService);
  private subscription!: Subscription;
  private messageService = inject(MessageService);
  private confirmationService = inject(ConfirmationService);

  potions: PotionOrder[] = [];
  expandedRows = {};

  ngOnInit(): void {
    this.subscription = this.potionService.potions$.subscribe(
      potions => {
        this.potions = potions;
      }
    );
  }

  ngOnDestroy(): void {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }

  confirmRemovePotion(potionId: number) {
    this.confirmationService.confirm({
      message: 'Вы точно хотите удалить зелье?',
      header: 'Подтверждение',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.removePotion(potionId);
      },
      reject: () => {
        console.log('Действие отменено');
      }
    });
  }

  removePotion(potionId: number) {
    this.potionService.removePotion(potionId);

    this.messageService.add({severity: 'success', summary: 'Зелье успешно удалено!', detail: 'Зелье успешно удалено!'});
  }
}
