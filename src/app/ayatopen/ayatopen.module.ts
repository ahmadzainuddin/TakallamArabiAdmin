import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { AyatOpenPageRoutingModule } from './ayatopen-routing.module';

import { AyatOpenPage } from './ayatopen.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    AyatOpenPageRoutingModule
  ],
  declarations: [AyatOpenPage]
})
export class AyatOpenPageModule {}
