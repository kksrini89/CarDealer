import { Component, ViewChild } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';
import { IonicPage, NavController } from 'ionic-angular';
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

  constructor(
    // public formGroup: FormGroup,
    public formBuilder: FormBuilder,
    public navCtrl: NavController,
    private carService: CarAdminProvider
  ) {}

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

  save() {
    this.submitAttempt = true;

    if (!this.stockerForm.valid) {
      this.carSlider.slideTo(0);
      console.log('stocker form is not valid');
    } else if (!this.regInfoForm.valid) {
      this.carSlider.slideTo(1);
      console.log('Regulatory Info form is not valid');
    } else if (!this.priceForm.valid) {
      this.carSlider.slideTo(2);
      console.log('Price form is not valid');
    } else {
      console.log('success!');
      console.log(this.carDetailForm.value);
      console.log(this.stockerForm.value);
      console.log(this.regInfoForm.value);
      console.log(this.priceForm.value);
      // this.carService
    }
  }
}
