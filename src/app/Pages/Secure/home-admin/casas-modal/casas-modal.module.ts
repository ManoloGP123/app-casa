import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { CasasModalPageRoutingModule } from './casas-modal-routing.module';

import { CasasModalPage } from './casas-modal.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    CasasModalPageRoutingModule
  ],
  declarations: [CasasModalPage]
})
export class CasasModalPageModule {}
