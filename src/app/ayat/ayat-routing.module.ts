import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AyatPage } from './ayat.page';

const routes: Routes = [
  {
    path: '',
    component: AyatPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AyatPageRoutingModule {}
