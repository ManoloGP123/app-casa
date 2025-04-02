import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { CitasPage } from './citas.page';

const routes: Routes = [
  {
    path: '',
    component: CitasPage
  },
  
  {
    path: 'citas-modal',
    loadChildren: () => import('./citas-modal/citas-modal.module').then( m => m.CitasModalPageModule)
  },  {
    path: 'buscar-usuario',
    loadChildren: () => import('./buscar-usuario/buscar-usuario.module').then( m => m.BuscarUsuarioPageModule)
  }


];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class CitasPageRoutingModule {}
