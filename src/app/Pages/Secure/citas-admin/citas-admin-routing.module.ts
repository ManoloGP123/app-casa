import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { CitasAdminPage } from './citas-admin.page';

const routes: Routes = [
  {
    path: '',
    component: CitasAdminPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class CitasAdminPageRoutingModule {}
