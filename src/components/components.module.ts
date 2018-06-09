import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from 'ionic-angular';

import { GoogleLoginComponent } from './google-login/google-login';
import { StockerFormComponent } from './stocker-form/stocker-form';
import { AuthProvider } from '../providers/auth';

@NgModule({
  declarations: [GoogleLoginComponent, StockerFormComponent],
  imports: [CommonModule, IonicModule, FormsModule],
  exports: [GoogleLoginComponent, StockerFormComponent],
  providers: [AuthProvider]
})
export class ComponentsModule {}
