import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { CitasModalPage } from './citas-modal.page';

const routes: Routes = [
  {
    path: '',
    component: CitasModalPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class CitasModalPageRoutingModule {}
