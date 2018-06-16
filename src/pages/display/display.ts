import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';

import { CarAdminProvider } from '../../providers/car-admin.service';
import { Car } from '../../models/car.model';
import { Observable } from 'rxjs';

@IonicPage()
@Component({
  selector: 'page-display',
  templateUrl: 'display.html'
})
export class DisplayPage {
  carDealsList$: Observable<any[]>;

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public carProvider: CarAdminProvider
  ) {}

  ionViewWillEnter() {
    this.carDealsList$ = this.carProvider.getCars();
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad DisplayPage');
  }

  getDetail(car: Car) {
    console.log(car);
  }
}
