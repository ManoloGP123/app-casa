import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { CasasPageRoutingModule } from './casas-routing.module';

import { CasasPage } from './casas.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    CasasPageRoutingModule
  ],
  declarations: [CasasPage]
})
export class CasasPageModule {}
