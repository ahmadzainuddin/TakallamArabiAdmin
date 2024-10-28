import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { AyatPageRoutingModule } from './ayat-routing.module';

import { AyatPage } from './ayat.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    AyatPageRoutingModule
  ],
  declarations: [AyatPage]
})
export class AyatPageModule {}
