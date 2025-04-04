import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { HomeAsesorPage } from './home-asesor.page';

const routes: Routes = [
  {
    path: '',
    component: HomeAsesorPage
  },  {
    path: 'negociacion-modal',
    loadChildren: () => import('./negociacion-modal/negociacion-modal.module').then( m => m.NegociacionModalPageModule)
  }

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class HomeAsesorPageRoutingModule {}
