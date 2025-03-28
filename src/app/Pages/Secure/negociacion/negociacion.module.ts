import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { NegociacionPageRoutingModule } from './negociacion-routing.module';

import { NegociacionPage } from './negociacion.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    NegociacionPageRoutingModule
  ],
  declarations: [NegociacionPage]
})
export class NegociacionPageModule {}
