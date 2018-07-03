import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { Observable } from 'rxjs';

import { Car } from '../../models/car.model';
import { CarAdminProvider } from '../../providers/car-admin.service';

@IonicPage()
@Component({
  selector: 'page-display',
  templateUrl: 'display.html'
})
export class DisplayPage {
  searchInput: string = '';

  carDealsList$: Observable<any[]>;
  carList: any[];

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public carProvider: CarAdminProvider
  ) {}

  ionViewWillEnter() {
    this.carDealsList$ = this.carProvider.getCars();
    this.carDealsList$.subscribe(items => (this.carList = items));
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad DisplayPage');
  }

  OnInput(event: any) {
    let tempSpace = [];
    this.carProvider.getCars().subscribe(items => {
      tempSpace = items;
      let inputValue = event.target.value;
      if (inputValue && inputValue.trim() !== '') {
        this.carList =
          tempSpace &&
          tempSpace.length &&
          tempSpace.filter((item: any) => {
            return (
              item.model
                .toString()
                .toLowerCase()
                .indexOf(inputValue.toLowerCase()) > -1
            );
          });
      }
    });
  }

  OnCancel(event: any) {
    this.carProvider.getCars().subscribe(items => (this.carList = items));
  }

  getDetail(car: Car) {
    this.navCtrl.push('CarDetailPage', { 'selected-car': JSON.stringify(car) });
  }
}
