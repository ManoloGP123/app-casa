import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { CitasAsesorPage } from './citas-asesor.page';

const routes: Routes = [
  {
    path: '',
    component: CitasAsesorPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class CitasAsesorPageRoutingModule {}
