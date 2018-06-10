import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { IonicModule } from 'ionic-angular';

import { GoogleLoginComponent } from './google-login/google-login';
import { StockerFormComponent } from './stocker-form/stocker-form';
import { RegulatoryInfoComponent } from './regulatory-info/regulatory-info';
import { PriceInfoComponent } from './price-info/price-info';
import { AuthProvider } from '../providers/auth';
import { CarAdminProvider } from '../providers/car-admin.service';
import { HttpClientModule } from '@angular/common/http';

@NgModule({
  declarations: [
    GoogleLoginComponent,
    StockerFormComponent,
    RegulatoryInfoComponent,
    PriceInfoComponent
  ],
  imports: [CommonModule, IonicModule, FormsModule, HttpClientModule, ReactiveFormsModule],
  exports: [
    GoogleLoginComponent,
    StockerFormComponent,
    RegulatoryInfoComponent,
    PriceInfoComponent
  ],
  providers: [AuthProvider, CarAdminProvider]
})
export class ComponentsModule {}
