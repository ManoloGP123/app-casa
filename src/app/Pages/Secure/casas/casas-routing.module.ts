import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { CasasPage } from './casas.page';

const routes: Routes = [
  {
    path: '',
    component: CasasPage
  },  {
    path: 'casas-modal',
    loadChildren: () => import('./casas-modal/casas-modal.module').then( m => m.CasasModalPageModule)
  }

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class CasasPageRoutingModule {}
