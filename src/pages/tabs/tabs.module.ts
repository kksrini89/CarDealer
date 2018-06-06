import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { ComponentsModule } from '../../components/components.module';
import { TabsPage } from './tabs';

@NgModule({
  declarations: [TabsPage],
  imports: [IonicPageModule.forChild(TabsPage), ComponentsModule]
})
export class TabsPageModule {}
