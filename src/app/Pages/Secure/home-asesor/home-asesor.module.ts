import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { HomeAsesorPageRoutingModule } from './home-asesor-routing.module';

import { HomeAsesorPage } from './home-asesor.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    HomeAsesorPageRoutingModule
  ],
  declarations: [HomeAsesorPage]
})
export class HomeAsesorPageModule {}
