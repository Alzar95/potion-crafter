import {Component} from '@angular/core';
import {PotionFormComponent} from './components/potion-form/potion-form.component';
import {PotionListComponent} from './components/potion-list/potion-list.component';

@Component({
  selector: 'app-potion-brewery-page',
  imports: [PotionFormComponent, PotionListComponent],
  templateUrl: './potion-brewery-page.component.html',
  styleUrl: './potion-brewery-page.component.scss',
})
export class PotionBreweryPageComponent {
}
