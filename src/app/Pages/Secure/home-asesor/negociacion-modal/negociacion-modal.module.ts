import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { NegociacionModalPageRoutingModule } from './negociacion-modal-routing.module';

import { NegociacionModalPage } from './negociacion-modal.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    NegociacionModalPageRoutingModule
  ],
  declarations: [NegociacionModalPage]
})
export class NegociacionModalPageModule {}
