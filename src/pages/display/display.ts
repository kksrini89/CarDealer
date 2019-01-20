import { Component } from '@angular/core';
import {
  IonicPage,
  NavController,
  ToastController,
  NavParams,
  AlertController,
  Tabs
} from 'ionic-angular';
import { Storage } from '@ionic/storage';
import { NativeStorage } from '@ionic-native/native-storage';
import { Observable } from 'rxjs';

import { CarAdminProvider } from '../../providers/car-admin.service';
import { AuthProvider } from '../../providers/auth.service';
import { Car } from '../../models/car.model';
import { User } from '../../models/user.model';

@IonicPage()
@Component({
  selector: 'page-display',
  templateUrl: 'display.html'
})
export class DisplayPage {
  tabsCtrl: Tabs;
  searchInput: string = '';

  user: any;
  carDealsList$: Observable<any[]>;
  carList: any[];
  isEditModeEnabled: boolean = false;
  public API_URL: string = 'http://192.168.0.102:7777/api/car';

  constructor(
    public navCtrl: NavController,
    public toastCtrl: ToastController,
    public alertCtrl: AlertController,
    public navParams: NavParams,
    public storage: Storage,
    public nStorage: NativeStorage,
    public authService: AuthProvider,
    public carProvider: CarAdminProvider
  ) {}

  ionViewWillEnter() {
    console.log(this.isEditModeEnabled);
    this.carProvider.getCars().then(items => {
      console.log(items);
      this.carList = items;
    });
    this.authService.getCurrentUser().then(res => {
      this.user = res;
      console.log(this.user);
    });
    // this.carDealsList$.subscribe(items => (this.carList = items));
  }

  ionViewDidLoad() {
    // console.log('ionViewDidLoad DisplayPage');
  }

  OnInput(event: any) {
    let tempSpace = [];
    this.carProvider.getCars().then(items => {
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
    this.carProvider.getCars().then(items => (this.carList = items));
  }

  getDetail(car: Car) {
    console.log(car);
    this.navCtrl.push('CarDetailPage', { 'selected-car': JSON.stringify(car) });
  }

  public selectedCar: string = '';
  async editItem(car: any) {
    console.log(car);
    // this.carProvider.selectedCar = car;
    const stringifyCar = JSON.stringify(car);
    this.selectedCar = stringifyCar;
    // const storageKey = this.carProvider.getEditedCarStorageKey();
    await this.storage.remove('edited-car');
    await this.storage.set('edited-car', stringifyCar);
    // this.nStorage.setItem(storageKey, stringifyCar).then(val => console.log('Stored edited-car'));
    this.carProvider.setSelectedCar(car);
    this.isEditModeEnabled = true;
    this.tabsCtrl = this.navCtrl.parent;
    this.tabsCtrl.select(0); //.then(x=> console.log('transitioned from display page to upload page'));
  }

  ionViewWillLeave() {
    console.log(this.isEditModeEnabled);
    this.storage
      .set('edited-car', this.selectedCar)
      .then(val => console.log('Set selectedCar value'));
    // if (!this.isEditModeEnabled) {
    //   const storageKey: string = this.carProvider.getEditedCarStorageKey();
    //   this.storage.get(storageKey).then(async val => {
    //     if (val && val != '') {
    //       await this.storage.remove(storageKey);
    //       // .then(val => console.log('In Non Edit Mode - edited-car storage key is removed'));
    //     }
    //   });
    // }
  }

  ionViewDidLeave() {
    this.isEditModeEnabled = false;
  }

  async deleteItem(car: any) {
    try {
      console.log(car);
      // const user = await this.authService.getCurrentUser();
      // console.log(user);
      if (car.hasOwnProperty('createdBy') && this.user.hasOwnProperty('_id')) {
        if (
          this.user.roles == 'admin' ||
          this.user.roles == 'editor' ||
          car.createdBy._id.toString() === this.user._id.toString()
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
}
