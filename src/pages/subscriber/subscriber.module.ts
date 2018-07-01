import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { SubscriberPage } from './subscriber';

@NgModule({
  declarations: [
    SubscriberPage,
  ],
  imports: [
    IonicPageModule.forChild(SubscriberPage),
  ]
})
export class SubscriberPageModule {}
