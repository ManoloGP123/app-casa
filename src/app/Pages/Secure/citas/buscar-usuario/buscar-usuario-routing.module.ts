import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { BuscarUsuarioPage } from './buscar-usuario.page';

const routes: Routes = [
  {
    path: '',
    component: BuscarUsuarioPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class BuscarUsuarioPageRoutingModule {}
