import { NgModule } from '@angular/core';
import { GoogleLoginComponent } from './google-login/google-login';
import { CommonModule } from '@angular/common';
@NgModule({
  declarations: [GoogleLoginComponent],
  imports: [CommonModule],
  exports: [GoogleLoginComponent]
})
export class ComponentsModule {}
