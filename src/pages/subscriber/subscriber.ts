import { Component } from '@angular/core';
import { IonicPage, NavController } from 'ionic-angular';

@IonicPage()
@Component({
  selector: 'page-subscriber',
  templateUrl: 'subscriber.html'
})
export class SubscriberPage {

  displayRoot = 'DisplayPage'
  profileRoot = 'ProfilePage'


  constructor(public navCtrl: NavController) {}

}
