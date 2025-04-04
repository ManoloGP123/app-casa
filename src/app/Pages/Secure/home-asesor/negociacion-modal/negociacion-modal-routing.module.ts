import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { NegociacionModalPage } from './negociacion-modal.page';

const routes: Routes = [
  {
    path: '',
    component: NegociacionModalPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class NegociacionModalPageRoutingModule {}
