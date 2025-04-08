import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ModalUsuariosPageRoutingModule } from './modal-usuarios-routing.module';

import { ModalUsuariosPage } from './modal-usuarios.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ModalUsuariosPageRoutingModule
  ],
  declarations: [ModalUsuariosPage]
})
export class ModalUsuariosPageModule {}
