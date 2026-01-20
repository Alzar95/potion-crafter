import { Routes } from '@angular/router';
import { PotionBreweryPageComponent } from './features/potion-brewery/potion-brewery-page.component';

export const routes: Routes = [
  { path: '', component: PotionBreweryPageComponent },
  { path: '**', redirectTo: '' }
];
