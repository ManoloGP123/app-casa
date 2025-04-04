import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { CitasAdminPageRoutingModule } from './citas-admin-routing.module';

import { CitasAdminPage } from './citas-admin.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    CitasAdminPageRoutingModule
  ],
  declarations: [CitasAdminPage]
})
export class CitasAdminPageModule {}
