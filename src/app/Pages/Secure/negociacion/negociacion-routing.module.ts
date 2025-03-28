import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { NegociacionPage } from './negociacion.page';

const routes: Routes = [
  {
    path: '',
    component: NegociacionPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class NegociacionPageRoutingModule {}
