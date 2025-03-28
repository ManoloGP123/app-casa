import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { HomeAsesorPage } from './home-asesor.page';

const routes: Routes = [
  {
    path: '',
    component: HomeAsesorPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class HomeAsesorPageRoutingModule {}
