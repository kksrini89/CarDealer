import { NgModule } from '@angular/core';
import { IonicPageModule, IonicModule } from 'ionic-angular';
import { UploadPage } from './upload';
import { ComponentsModule } from '../../components/components.module';

@NgModule({
  declarations: [UploadPage],
  imports: [IonicPageModule.forChild(UploadPage), ComponentsModule, IonicModule]
})
export class UploadPageModule {}
