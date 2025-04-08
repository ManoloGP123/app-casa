import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ModalUsuariosPage } from './modal-usuarios.page';

const routes: Routes = [
  {
    path: '',
    component: ModalUsuariosPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ModalUsuariosPageRoutingModule {}
