import { Component, ViewChild, AfterViewInit } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';
import {
  IonicPage,
  Tabs,
  NavController,
  LoadingController,
  AlertController,
  Loading
} from 'ionic-angular';
import { Camera, CameraOptions } from '@ionic-native/camera';

import { AuthProvider } from '../../providers/auth.service';
import { CommonProvider } from '../../providers/common.service';
import { CarAdminProvider } from '../../providers/car-admin.service';
import { AngularFireUploadTask, AngularFireStorage } from 'angularfire2/storage';
import { Observable } from 'rxjs';
import { finalize } from 'rxjs/operators';

@IonicPage()
@Component({
  selector: 'page-upload',
  templateUrl: 'upload.html'
})
export class UploadPage implements AfterViewInit {
  tabsCtrl: Tabs;
  @ViewChild('carSlider') carSlider: any;

  task: AngularFireUploadTask;
  percentageChanges: Observable<Number>;
  downloadURL: String;

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
    public camera: Camera,
    public afStorage: AngularFireStorage,
    public auth: AuthProvider,
    private carService: CarAdminProvider,
    private commonService: CommonProvider
  ) {}

  ngAfterViewInit() {
    this.carSlider.autoHeight = true;
  }

  ionViewCanEnter() {
    return this.auth.isLoggedIn();
    // return this.auth.isLoggedIn().then(res => {
    //   console.log(res);
    //   return res;
    // });
    // return true;
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
    this.tabsCtrl = this.navCtrl.parent;
    // this.carSlider.autoHeight = true;
    this.loadForm();
  }

  /*public slidesHeight: string | number;
  public slidesMoving: boolean = true;
  slideDidChange() {
    this.slidesMoving = false;
    let slideIndex : number = this.carSlider.getActiveIndex();
    let currentSlide : Element = this.carSlider._slides[slideIndex];
    this.slidesHeight = currentSlide.clientHeight;
  }

  slideWillChange() {
    this.slidesMoving = true;
  } */

  loadForm(): void {
    this.carDetailForm = this.formBuilder.group({
      photo: [''],
      mileage: [20],
      duration: ['1 year'],
      description: [''],
      isCarAccidental: [false],
      isCarCertified: [true],
      isCarFloodAffected: [false],
      stockEntryDate: [Date.now()]
    });

    this.stockerForm = this.formBuilder.group({
      cMake: [''],
      cModel: [''],
      cVarriant: [''],
      cMake_year: [Date.now()],
      cNumber_of_owners: [''],
      cKms_driven: [''],
      cTransmission_type: [''],
      cFuel_type: [''],
      cCondition: ['good'],
      cColor: ['red'],
      cVehicle_type: ['4 Gear'],
      cInspection_valid_until: [Date.now()]
    });

    this.regInfoForm = this.formBuilder.group({
      registrationPlace: [''],
      insurance_type: [''],
      insurance_year: [Date.now()]
    });

    this.priceForm = this.formBuilder.group({
      amount: [0],
      isFixed: [true],
      isExchangeAccepted: [false],
      warranty: ['']
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
      // spinner: 'hide',
      content: `Saving`,
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
          amount: this.priceForm.get('amount').value,
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
          stock_entryDate: this.carDetailForm.get('stockEntryDate').value,
          createdBy: await this.auth.getCurrentUser(),
          createdDate: Date.now
        };
        console.log(newCar);
        await this.carService.addCar(newCar);
        this.stockerForm.reset();
        this.priceForm.reset();
        this.regInfoForm.reset();
        this.carDetailForm.reset();
        this.submitAttempt = false;
      }
      this.loading.dismiss();
      // this.navCtrl.push('DisplayPage');
      this.tabsCtrl.select(2);
    } catch (error) {
      this.loading.dismiss();
      this.commonService.errorAlert('Error', 'Something fishy happened!');
    }
  }

  /**
   * To pick car image from gallery
   *  sourceType = 0 // Photo Library
   *  sourceType = 1 // Camera
   */
  addFromGallery() {
    const options: CameraOptions = {
      quality: 33,
      destinationType: this.camera.DestinationType.DATA_URL,
      encodingType: this.camera.EncodingType.JPEG,
      mediaType: this.camera.MediaType.PICTURE,
      correctOrientation: true,
      sourceType: 0
    };

    this.camera.getPicture(options).then(
      imageData => {
        let loadingCtrl = this.loadingCtrl.create({
          // spinner: 'hide',
          content: `Saving`,
          dismissOnPageChange: true
        });
        loadingCtrl.present();
        let base64Image = 'data:image/jpeg;base64,' + imageData;
        this.uploadImage(base64Image);
        loadingCtrl.dismiss();
      },
      err => {
        this.commonService.errorAlert('Error in Gallery', 'Please try one more time!');
      }
    );
  }

  uploadImage(base64Image) {
    const filePath = `uploads/images/${new Date().getTime()}`;
    const ref = this.afStorage.ref(filePath);
    this.task = ref.putString(base64Image, 'data_url');
    this.percentageChanges = this.task.percentageChanges();
    this.task
      .snapshotChanges()
      .pipe(
        finalize(() => {
          ref.getDownloadURL().subscribe(url => {
            this.downloadURL = url;
            this.carDetailForm.get('photo').setValue(this.downloadURL);
          });
        })
      )
      .subscribe();
  }
}
