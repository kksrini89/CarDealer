import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';

@IonicPage()
@Component({
  selector: 'page-car-detail',
  templateUrl: 'car-detail.html'
})
export class CarDetailPage {
  selectedCar: any = {};
  public API_URL: string = 'http://192.168.0.102:7777/api';

  constructor(public navCtrl: NavController, public navParams: NavParams) {
    console.log(JSON.parse(this.navParams.get('selected-car')));
    // this.selectedCar = this.navParams.get('selected-car');
    this.selectedCar = JSON.parse(this.navParams.get('selected-car'));
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad CarDetailPage');
  }

  navigateBack() {
    this.navCtrl.pop();
  }
}
