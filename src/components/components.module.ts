import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { IonicModule } from 'ionic-angular';
import { Network } from '@ionic-native/network';
import { NativeStorage } from '@ionic-native/native-storage';

import { GoogleLoginComponent } from './google-login/google-login';
import { StockerFormComponent } from './stocker-form/stocker-form';
import { RegulatoryInfoComponent } from './regulatory-info/regulatory-info';
import { PriceInfoComponent } from './price-info/price-info';
import { AuthProvider } from '../providers/auth.service';
import { CarAdminProvider } from '../providers/car-admin.service';
import { HttpClientModule } from '@angular/common/http';
import { RegisterComponent } from './register/register';
import { LoginComponent } from './login/login';

@NgModule({
  declarations: [
    GoogleLoginComponent,
    StockerFormComponent,
    RegulatoryInfoComponent,
    PriceInfoComponent,
    RegisterComponent,
    LoginComponent
  ],
  imports: [CommonModule, IonicModule, FormsModule, HttpClientModule, ReactiveFormsModule],
  exports: [
    GoogleLoginComponent,
    StockerFormComponent,
    RegulatoryInfoComponent,
    PriceInfoComponent,
    RegisterComponent,
    LoginComponent
  ],
  providers: [Network, NativeStorage, AuthProvider, CarAdminProvider]
})
export class ComponentsModule {}
