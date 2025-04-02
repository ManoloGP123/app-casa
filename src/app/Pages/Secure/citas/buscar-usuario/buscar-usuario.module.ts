import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { BuscarUsuarioPageRoutingModule } from './buscar-usuario-routing.module';

import { BuscarUsuarioPage } from './buscar-usuario.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    BuscarUsuarioPageRoutingModule
  ],
  declarations: [BuscarUsuarioPage]
})
export class BuscarUsuarioPageModule {}
