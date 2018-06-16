import { Component, ViewChild } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';
import {
  IonicPage,
  NavController,
  LoadingController,
  AlertController,
  Loading
} from 'ionic-angular';

import { AuthProvider } from '../../providers/auth.service';
import { CommonProvider } from '../../providers/common.service';
import { CarAdminProvider } from '../../providers/car-admin.service';

@IonicPage()
@Component({
  selector: 'page-upload',
  templateUrl: 'upload.html'
})
export class UploadPage {
  @ViewChild('carSlider') carSlider: any;

  public carDetailForm: FormGroup;
  public stockerForm: FormGroup;
  public regInfoForm: FormGroup;
  public priceForm: FormGroup;
  public submitAttempt: boolean = false;
  public loading: Loading;

  constructor(
    public formBuilder: FormBuilder,
    public navCtrl: NavController,
    public loadingCtrl: LoadingController,
    public alertCtrl: AlertController,
    public auth: AuthProvider,
    private carService: CarAdminProvider,
    private commonService: CommonProvider
  ) {}

  ionViewCanEnter() {
    // return this.auth.isLoggedIn();
    // return this.auth.isLoggedIn().then(res => {
    //   console.log(res);
    //   return res;
    // });
    return true;
  }

  ionViewCanLeave() {
    let alert = this.alertCtrl.create({
      title: 'Confirm',
      message: 'Are you sure want to leave?',
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
          handler: () => {
            console.log('Confirm Cancel clicked');
          }
        },
        {
          text: 'Yes',
          handler: () => {
            if (this.loading) {
              this.loading.dismiss().then(() => console.log('Loading dismissed!'));
            }
          }
        }
      ]
    });
    alert.present();
  }

  ionViewWillEnter() {
    this.loadForm();
  }

  loadForm(): void {
    this.carDetailForm = this.formBuilder.group({
      photo: ['www.google.com'],
      mileage: [20],
      duration: ['1 year'],
      description: [''],
      isCarAccidental: [false],
      isCarCertified: [true],
      isCarFloodAffected: [false],
      stockEntryDate: [Date.now()]
    });

    this.stockerForm = this.formBuilder.group({
      cMake: ['value'],
      cModel: ['value'],
      cVarriant: ['value'],
      cMake_year: [Date.now()],
      cNumber_of_owners: ['value'],
      cKms_driven: ['value'],
      cTransmission_type: ['value'],
      cFuel_type: ['value'],
      cCondition: ['good'],
      cColor: ['red'],
      cVehicle_type: ['4 Gear'],
      cInspection_valid_until: [Date.now()]
    });

    this.regInfoForm = this.formBuilder.group({
      registrationPlace: ['Madurai'],
      insurance_type: ['Joint'],
      insurance_year: [Date.now()]
    });

    this.priceForm = this.formBuilder.group({
      isFixed: [true],
      isExchangeAccepted: [false],
      warranty: ['Joint']
    });
  }

  next(): void {
    this.carSlider.slideNext();
  }

  previous(): void {
    this.carSlider.slidePrev();
  }

  async save() {
    this.submitAttempt = true;
    this.loading = this.loadingCtrl.create({
      spinner: 'hide',
      content: `
        <div class="custom-spinner-container">
          <div class="custom-spinner-box"></div>
        </div>`,
      dismissOnPageChange: true
    });
    try {
      this.loading.present();
      if (!this.carDetailForm.valid) {
        this.carSlider.slideTo(0);
        console.log('Car detail form is not valid');
      } else if (!this.stockerForm.valid) {
        this.carSlider.slideTo(1);
        console.log('Stocker form is not valid');
      } else if (!this.regInfoForm.valid) {
        this.carSlider.slideTo(2);
        console.log('Regulatory Info form is not valid');
      } else if (!this.priceForm.valid) {
        this.carSlider.slideTo(3);
        console.log('Price form is not valid');
      } else {
        console.log('success!');

        const newCar: any = {
          make: this.stockerForm.get('cMake').value,
          model: this.stockerForm.get('cModel').value,
          varriant: this.stockerForm.get('cVarriant').value,
          make_year: this.stockerForm.get('cMake_year').value,
          number_of_owners: this.stockerForm.get('cNumber_of_owners').value,
          kms_driven: this.stockerForm.get('cKms_driven').value,
          transmission_type: this.stockerForm.get('cTransmission_type').value,
          fuel_type: this.stockerForm.get('cFuel_type').value,
          condition: this.stockerForm.get('cCondition').value,
          color: this.stockerForm.get('cColor').value,
          vehicle_type: this.stockerForm.get('cVehicle_type').value,
          inspection_valid_until: this.stockerForm.get('cInspection_valid_until').value,
          registrationPlace: this.regInfoForm.get('registrationPlace').value,
          insurance_type: this.regInfoForm.get('insurance_type').value,
          insurance_year: this.regInfoForm.get('insurance_year').value,
          isFixed: this.priceForm.get('isFixed').value,
          isExchangeAccepted: this.priceForm.get('isExchangeAccepted').value,
          warranty: this.priceForm.get('warranty').value,
          photo: this.carDetailForm.get('photo').value,
          duration: this.carDetailForm.get('duration').value,
          mileage: this.carDetailForm.get('mileage').value,
          description: this.carDetailForm.get('description').value,
          isCarAccidental: this.carDetailForm.get('isCarAccidental').value,
          isCarCertified: this.carDetailForm.get('isCarCertified').value,
          isCarFloodAffected: this.carDetailForm.get('isCarFloodAffected').value,
          stock_entryDate: this.carDetailForm.get('stockEntryDate').value
        };
        console.log(newCar);
        await this.carService.addCar(newCar);
      }
      this.loading.dismiss();
      this.navCtrl.push('DisplayPage');
    } catch (error) {
      this.loading.dismiss();
      this.commonService.errorAlert('Error', 'Something fishy happened!');
    }
  }
}
