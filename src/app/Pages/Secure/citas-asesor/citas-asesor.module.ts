import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { CitasAsesorPageRoutingModule } from './citas-asesor-routing.module';

import { CitasAsesorPage } from './citas-asesor.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    CitasAsesorPageRoutingModule
  ],
  declarations: [CitasAsesorPage]
})
export class CitasAsesorPageModule {}
