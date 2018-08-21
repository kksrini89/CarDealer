import { Component } from '@angular/core';
import {
  IonicPage,
  NavController,
  ToastController,
  NavParams,
  AlertController
} from 'ionic-angular';
import { Observable } from 'rxjs';

import { CarAdminProvider } from '../../providers/car-admin.service';
import { AuthProvider } from '../../providers/auth.service';
import { Car } from '../../models/car.model';
import { User } from '../../models/user.model';
import { UploadPage } from '../upload/upload';


@IonicPage()
@Component({
  selector: 'page-display',
  templateUrl: 'display.html'
})
export class DisplayPage {
  searchInput: string = '';

  user: User;
  carDealsList$: Observable<any[]>;
  carList: any[];

  constructor(
    public navCtrl: NavController,
    public toastCtrl: ToastController,
    public alertCtrl: AlertController,
    public navParams: NavParams,
    public authService: AuthProvider,
    public carProvider: CarAdminProvider
  ) {}

  ionViewWillEnter() {
    this.carDealsList$ = this.carProvider.getCars();
    this.authService.getCurrentUser().then(res => (this.user = res));
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

  async deleteItem(car: any) {
    try {
      console.log(car);
      // const user = await this.authService.getCurrentUser();
      // console.log(user);
      if (car.hasOwnProperty('createdBy') && this.user.hasOwnProperty('uid')) {
        if (
          this.user.roles.admin ||
          this.user.roles.editor ||
          car.createdBy.uid === this.user.uid
        ) {
          // const alert = this.alertCtrl.create({
          //   title: 'Unauthorized!',
          //   subTitle: `You can not delete since you're not the creator for this!`,
          //   buttons: ['OK']
          // });
          // alert.present();
          await this.carProvider.deleteCar(car);
          let toastCtrl = this.toastCtrl.create({
            message: `${car.model} Deleted successfully`,
            duration: 3000
          });
          await toastCtrl.present();
        }
      }
    } catch (error) {
      this.toastCtrl
        .create({
          message: `${error}`,
          duration: 3000
        })
        .present();
      throw error;
    }
  }
  pushtoupload() {
    this.navCtrl.push(UploadPage);
  }
}
