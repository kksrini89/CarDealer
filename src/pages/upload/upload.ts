import { Component, ViewChild, AfterViewInit } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';
import {
  IonicPage,
  Tabs,
  NavController,
  ToastController,
  LoadingController,
  AlertController,
  Loading
} from 'ionic-angular';
import { Camera, CameraOptions } from '@ionic-native/camera';
import { ImagePicker } from '@ionic-native/image-picker';
import * as firebase from 'firebase/app';
import { AngularFireUploadTask, AngularFireStorage } from 'angularfire2/storage';
import { Observable } from 'rxjs';
import { finalize } from 'rxjs/operators';
import { Storage } from '@ionic/storage';
import { NativeStorage } from '@ionic-native/native-storage';

import { AuthProvider } from '../../providers/auth.service';
import { CommonProvider } from '../../providers/common.service';
import { CarAdminProvider } from '../../providers/car-admin.service';

@IonicPage()
@Component({
  selector: 'page-upload',
  templateUrl: 'upload.html'
})
export class UploadPage implements AfterViewInit {
  tabsCtrl: Tabs;
  @ViewChild('carSlider')
  carSlider: any;

  task: AngularFireUploadTask;
  percentageChanges: Observable<Number>;
  downloadURL: String;

  // public dealerForm: any;
  public dealerForm: any = {
    showroomName: '',
    address: '',
    city: '',
    state: '',
    contact_no: '',
    profile_image: ''
  };
  public carDetailForm: FormGroup;
  public stockerForm: FormGroup;
  public regInfoForm: FormGroup;
  public priceForm: FormGroup;
  public submitAttempt: boolean = false;
  public loading: Loading;
  public selectedImages: any[];
  public cameraImages: any[];
  public galleryImages: any[];
  public selectedCarInEdit: any;
  public editedCarImages: String[] = [];
  public mode: string = '';

  users: any = [];
  dealers: any[] = [];

  constructor(
    public formBuilder: FormBuilder,
    public navCtrl: NavController,
    public toastCtrl: ToastController,
    public loadingCtrl: LoadingController,
    public alertCtrl: AlertController,
    public camera: Camera,
    public imagePicker: ImagePicker,
    private storage: Storage,
    private nStorage: NativeStorage,
    public afStorage: AngularFireStorage,
    public auth: AuthProvider,
    public carService: CarAdminProvider,
    private commonService: CommonProvider
  ) {
    this.selectedImages = [];
    this.galleryImages = [];
    this.cameraImages = [];
    this.dealerForm = {
      // name: '',
      showroomName: '',
      address: '',
      city: '',
      state: '',
      contact_no: '',
      profile_image: ''
      // isMobileNumberValid: true
    };
    this.auth.getDealers();
    // console.log(this.carService.selectedCar)
    // if (this.carService.selectedCar) {
    //   const { state, city, showroomName, address, contact_no } = this.carService.selectedCar;
    //   this.auth.selectedDealer = { state, city, showroomName, address, contact_no };
    // }
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
    this.auth.getUsers().subscribe(users => {
      this.users = users;
      console.log(this.users);
    });
    // this.storage.get('edited-car').then(val => {
    //   if (val != '' && val !== null) {
    //     this.selectedCarInEdit = JSON.parse(val);
    //     console.log(this.selectedCarInEdit);
    //   }
    // });
    // const storageKey = this.carService.getEditedCarStorageKey();
    // this.nStorage.getItem(storageKey).then(val => {
    //   this.selectedCarInEdit = JSON.parse(val);
    //   console.log('After assigning edited car - ', this.selectedCarInEdit);
    // });
  }

  ionViewWillLeave() {
    // this.selectedCarInEdit = null;
    // this.nStorage
    //   .remove(this.carService.getEditedCarStorageKey())
    //   .then(val => console.log('edited-car key is removed'));
    this.mode = '';
    this.storage
      .remove('edited-car')
      .then(val => console.log('edited-car key is removed from storage!'));
  }

  async ionViewDidEnter() {
    this.dealers = this.auth.dealers;
    // this.selectedCarInEdit = this.carService.getSelectedCar();
    // this.storage.get('edited-car').then(val => {
    const val = await this.storage.get('edited-car');
      if (val !== '' && val !== undefined && val !== null) {
        console.log(val);
        this.selectedCarInEdit = JSON.parse(val);
        this.mode = 'edit';
        console.log(this.selectedCarInEdit + '-' + this.mode);
      }
    // });
    // console.log(this.selectedCarInEdit);
    if (this.selectedCarInEdit) {
      const {
        state,
        city,
        showroomName,
        address,
        contact_no,
        profile_image,
        photo
      } = this.selectedCarInEdit;
      this.auth.selectedDealer = { state, city, showroomName, address, contact_no, profile_image };
      this.editedCarImages = photo;
      // if (this.selectedCarInEdit) {
      // const editedCar: any = this.carService.selectedCar;
      this.assignValuesInEditMode(this.selectedCarInEdit);
      // }
    }
    if (this.auth.selectedDealer) {
      this.dealerForm['showroomName'] = this.auth.selectedDealer['showroomName'];
      this.dealerForm['address'] = this.auth.selectedDealer['address'];
      this.dealerForm['city'] = this.auth.selectedDealer['city'];
      this.dealerForm['state'] = this.auth.selectedDealer['state'];
      this.dealerForm['contact_no'] = this.auth.selectedDealer['contact_no'];
      this.dealerForm['profile_image'] = this.auth.selectedDealer['profile_image'];
    }
    console.log(this.dealers);
    // this.storage.ready().then(data => {
    //   this.storage.get('dealer_info').then(dealer_info => {
    //     console.log(dealer_info);
    //     this.dealerForm = {
    //       name: dealer_info['name'],
    //       showroomName: dealer_info.showroomName,
    //       address: dealer_info.address,
    //       city: dealer_info.city,
    //       state: dealer_info.state,
    //       contact_no: dealer_info.contact_no
    //     };
    //   });
    // });
  }

  assignValuesInEditMode(editedCar: any): void {
    // CarDetailForm
    if (typeof editedCar.mileage !== 'undefined') {
      this.carDetailForm.get('mileage').setValue(editedCar.mileage);
    }
    if (typeof editedCar.duration !== 'undefined') {
      this.carDetailForm.get('duration').setValue(editedCar.duration);
    }
    if (typeof editedCar.description !== 'undefined') {
      this.carDetailForm.get('description').setValue(editedCar.description);
    }
    if (typeof editedCar.isCarAccidental !== 'undefined') {
      this.carDetailForm.get('isCarAccidental').setValue(editedCar.isCarAccidental);
    }
    if (typeof editedCar.isCarCertified !== 'undefined') {
      this.carDetailForm.get('isCarCertified').setValue(editedCar.isCarCertified);
    }
    if (typeof editedCar.isCarFloodAffected !== 'undefined') {
      this.carDetailForm.get('isCarFloodAffected').setValue(editedCar.isCarFloodAffected);
    }
    if (typeof editedCar.stockEntryDate !== 'undefined') {
      this.carDetailForm.get('stockEntryDate').setValue(editedCar.stockEntryDate);
    }

    // stockerForm
    if (typeof editedCar.make !== 'undefined') {
      this.stockerForm.get('cMake').setValue(editedCar.make);
    }
    if (typeof editedCar.model !== 'undefined') {
      this.stockerForm.get('cModel').setValue(editedCar.model);
    }
    if (typeof editedCar.varriant !== 'undefined') {
      this.stockerForm.get('cVarriant').setValue(editedCar.varriant);
    }
    if (typeof editedCar.make_year !== 'undefined') {
      this.stockerForm.get('cMake_year').setValue(editedCar.make_year);
    }
    if (typeof editedCar.number_of_owners !== 'undefined') {
      this.stockerForm.get('cNumber_of_owners').setValue(editedCar.number_of_owners);
    }
    if (typeof editedCar.kms_driven !== 'undefined') {
      this.stockerForm.get('cKms_driven').setValue(editedCar.kms_driven);
    }
    if (typeof editedCar.transmission_type !== 'undefined') {
      this.stockerForm.get('cTransmission_type').setValue(editedCar.transmission_type);
    }
    if (typeof editedCar.fuel_type !== 'undefined') {
      this.stockerForm.get('cFuel_type').setValue(editedCar.fuel_type);
    }
    if (typeof editedCar.condition !== 'undefined') {
      this.stockerForm.get('cCondition').setValue(editedCar.condition);
    }
    if (typeof editedCar.color !== 'undefined') {
      this.stockerForm.get('cColor').setValue(editedCar.color);
    }
    if (typeof editedCar.vehicle_type !== 'undefined') {
      this.stockerForm.get('cVehicle_type').setValue(editedCar.vehicle_type);
    }
    if (typeof editedCar.inspection_valid_until !== 'undefined') {
      this.stockerForm.get('cInspection_valid_until').setValue(editedCar.inspection_valid_until);
    }

    // regInfoForm
    if (typeof editedCar.registrationPlace !== 'undefined') {
      this.regInfoForm.get('registrationPlace').setValue(editedCar.registrationPlace);
    }
    if (typeof editedCar.insurance_type !== 'undefined') {
      this.regInfoForm.get('insurance_type').setValue(editedCar.insurance_type);
    }
    if (typeof editedCar.insurance_year !== 'undefined') {
      this.regInfoForm.get('insurance_year').setValue(editedCar.insurance_year);
    }

    // priceForm
    if (typeof editedCar.amount !== 'undefined') {
      this.priceForm.get('amount').setValue(editedCar.amount);
    }
    if (typeof editedCar.isFixed !== 'undefined') {
      this.priceForm.get('isFixed').setValue(editedCar.isFixed);
    }
    if (typeof editedCar.isExchangeAccepted !== 'undefined') {
      this.priceForm.get('isExchangeAccepted').setValue(editedCar.isExchangeAccepted);
    }
    if (typeof editedCar.warranty !== 'undefined') {
      this.priceForm.get('warranty').setValue(editedCar.warranty);
    }
  }

  ngAfterViewInit() {
    this.carSlider.autoHeight = true;
    // this.storage.ready().then(data => {
    //   this.storage.get('dealer_info').then(dealer_info => {
    //     console.log(dealer_info['name']);
    //     if (typeof dealer_info !== 'undefined') {
    //       this.dealerForm = {
    //         name: dealer_info['name'],
    //         showroomName: dealer_info.showroomName,
    //         address: dealer_info.address,
    //         city: dealer_info.city,
    //         state: dealer_info.state,
    //         contact_no: dealer_info.contact_no
    //       };
    //     }
    //   });
    // });
  }

  onDealerChanged(d) {
    console.log('ion-change:', d);
    this.dealerForm['showroomName'] = d['showroomName'];
    this.dealerForm['address'] = d['address'];
    this.dealerForm['city'] = d['city'];
    this.dealerForm['state'] = d['state'];
    this.dealerForm['contact_no'] = d['contact_no'];
    this.dealerForm['profile_image'] = d['profile_image'];
    // this.carSlider.resize();
    this.carSlider.autoHeight = true;
    this.auth.selectedDealer = d;
  }

  onDealerOptionSelected(dealer) {
    console.log(dealer['dealer_info']);
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

  resetDealerDetails() {
    this.dealerForm = {
      // name: '',
      showroomName: '',
      address: '',
      city: '',
      state: '',
      contact_no: ''
      // isMobileNumberValid: true
    };
  }

  loadForm(): void {
    this.dealerForm = {
      // name: '',
      showroomName: '',
      address: '',
      city: '',
      state: '',
      contact_no: '',
      profile_image: ''
    };
    this.carDetailForm = this.formBuilder.group({
      // photo: [''],
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

  // onKeyup(value) {
  //   if (!this.commonService.mobileNumberRegex.test(value)) {
  //     this.dealerForm.isMobileNumberValid = false;
  //   }
  // }

  async save(mode: string) {
    this.submitAttempt = true;
    this.loading = this.loadingCtrl.create({
      // spinner: 'hide',
      content: `Saving`,
      dismissOnPageChange: true
    });
    try {
      this.loading.present();

      // if (!this.commonService.mobileNumberRegex.test(this.dealerForm.contact_no)) {
      //   this.dealerForm.isMobileNumberValid = false;
      //   this.carSlider.slideTo(0);
      // }

      if (!this.carDetailForm.valid) {
        this.carSlider.slideTo(0);
        console.log('Car detail form is not valid');
      } else if (!this.stockerForm.valid) {
        this.carSlider.slideTo(2);
        console.log('Stocker form is not valid');
      } else if (!this.regInfoForm.valid) {
        this.carSlider.slideTo(3);
        console.log('Regulatory Info form is not valid');
      } else if (!this.priceForm.valid) {
        this.carSlider.slideTo(4);
        console.log('Price form is not valid');
      } else {
        console.log('success!');
        let newCar: any = {
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
          duration: this.carDetailForm.get('duration').value,
          mileage: this.carDetailForm.get('mileage').value,
          description: this.carDetailForm.get('description').value,
          stockEntryDate: this.carDetailForm.get('stockEntryDate').value,
          isCarAccidental: this.carDetailForm.get('isCarAccidental').value,
          isCarCertified: this.carDetailForm.get('isCarCertified').value,
          isCarFloodAffected: this.carDetailForm.get('isCarFloodAffected').value
        };
        // newCar.isCarAccidental = this.carDetailForm.get('isCarAccidental').value;
        // newCar.isCarCertified = this.carDetailForm.get('isCarCertified').value;
        // newCar.isCarFloodAffected = this.carDetailForm.get('isCarFloodAffected').value;
        let user = await this.auth.getCurrentUser();
        newCar.createdBy = await this.auth.getUserProfile(user);
        newCar.createdDate = Date.now();
        // let photo_Urls: String[] = [];
        // Car Images uploading
        // const data = await this.uploadPics();
        // if (data !== null && data !== undefined) {
        //   newCar.photo = data;
        // }
        newCar.photo =
          this.carService.carSelectedImages && this.carService.carSelectedImages.length > 0
            ? this.carService.carSelectedImages
            : [];
        // Dealer details
        // newCar.name = this.dealerForm.name;
        newCar.showroomName = this.dealerForm.showroomName;
        newCar.address = this.dealerForm.address;
        newCar.city = this.dealerForm.city;
        newCar.state = this.dealerForm.state;
        newCar.contact_no = this.dealerForm.contact_no;
        newCar.profile_image = this.dealerForm.profile_image || '';
        console.log(newCar);

        // Uploading to db
        if (mode === 'edit') {
          newCar.photo =
            this.editedCarImages && this.editedCarImages.length > 0 ? this.editedCarImages : [];
          await this.carService.updateCar(this.selectedCarInEdit.id, newCar);
        } else {
          await this.carService.addCar(newCar);
        }

        // Storing dealer details to native storage
        // const dealer_info = {
        //   name: newCar.name,
        //   showroomName: newCar.showroomName,
        //   address: newCar.address,
        //   city: newCar.city,
        //   state: newCar.state,
        //   contact_no: newCar.contact_no
        // };
        // this.storage.set('dealer_info', dealer_info); //.then(data => console.log(`Entered - ${data}`));

        // Reset fields
        this.stockerForm.reset();
        this.priceForm.reset();
        this.regInfoForm.reset();
        this.carDetailForm.reset();
        // this.resetDealerDetails();
        this.editedCarImages = [];
        this.selectedImages = [];
        this.galleryImages = [];
        this.cameraImages = [];
        this.carService.carSelectedImages = [];
        this.submitAttempt = false;
        await this.storage.remove('edited-car');
      }
      this.loading.dismiss();
      // this.navCtrl.push('DisplayPage');
      this.tabsCtrl.select(2);
    } catch (error) {
      this.loading.dismiss();
      this.commonService.errorAlert('Error', error.message);
    }
  }

  // async resetPositionsAsyncAwait() {
  //   const db = firebase.firestore();
  //   const collRef = db.collection('cars');
  //   const query = collRef.orderBy('createdDate');
  //   const batch = db.batch();

  //   // Step 1 - Read document data and prepare batch updates
  //   try {
  //     const items = await query.get();
  //     let newCount = 0;
  //     items.forEach(async doc => {
  //       const docRef = collRef.doc(doc.id);
  //       batch.set(docRef, { position: newCount });
  //       newCount += 1;
  //     });
  //   } catch (error) {
  //     console.log('resetPositionsAsyncAwait (during Step 1): error caught. Error=');
  //   }

  //   // Step 2 - Run batch update
  //   try {
  //     await batch.commit();
  //   } catch (error) {
  //     console.log('resetPositionsAsyncAwait (during Step 2): error caught. Error=');
  //   }
  // }

  async uploadPics() {
    try {
      let photo_Urls = [];
      if (this.selectedImages.length > 0) {
        await this.asyncForEach(this.selectedImages, async img => {
          let base64Image = 'data:image/jpeg;base64,' + img;
          const filePath = `uploads/images/${new Date().getTime()}`;
          const ref = this.afStorage.ref(filePath);
          let task = ref.putString(base64Image, 'data_url');
          // ref
          //   .putString(base64Image, 'data_url')
          //   .then()
          //   .then(savedPicture => photo_Urls.push(savedPicture.downloadURL));
          await task
            .snapshotChanges()
            .pipe(
              finalize(() => {
                ref.getDownloadURL().subscribe(url => photo_Urls.push(url));
              })
            )
            .toPromise();
        });
        return photo_Urls;
      }
    } catch (error) {
      throw error;
    }
  }

  /**
   * Image chosen from mobile gallery
   */
  private addFromMobileGallery() {
    try {
      this.alertCtrl
        .create({
          title: 'Information',
          message: 'Maximum 4 images can be selected?',
          buttons: [
            // {
            //   text: 'Disagree',
            //   handler: () => {
            //     console.log('Disagree clicked');
            //   }
            // },
            {
              text: 'Agree',
              handler: () => {
                console.log('Agree clicked');
              }
            }
          ]
        })
        .present();
      this.imagePicker.hasReadPermission().then(
        result => {
          if (result == false) {
            // no callbacks required as this opens a popup which returns async
            this.imagePicker.requestReadPermission();
          } else if (result == true) {
            this.imagePicker
              .getPictures({
                maximumImagesCount: 4,
                height: 400,
                width: 400
              })
              .then(
                results => {
                  for (var i = 0; i < results.length; i++) {
                    // this.uploadImageToFirebase(results[i]);
                    this.newUploadImage(results[i]).then(url => {
                      this.carService.carSelectedImages.push(url);
                    }); //carPicImages.push(url));
                  }
                  if (results && typeof results === 'object' && Array.isArray(results)) {
                    this.selectedImages = results;
                    // this.cameraImages = [];
                    this.galleryImages = results;
                  }
                },
                err => {
                  console.log(err);
                }
              );
          }
        },
        err => {
          console.log(err);
        }
      );

      // let imagePickerOptions: ImagePickerOptions = {
      //   maximumImagesCount: 8,
      //   outputType: 1
      // };
      // return this.imagePicker.getPictures(imagePickerOptions).then(
      //   // file_uris => this._navCtrl.push(GalleryPage, {images: file_uris}),
      //   images => {
      //     return images;
      //   },
      //   err => err //this.commonService.errorAlert('Error', `Can't take pictures!`)
      // );
    } catch (error) {
      throw error;
    }
  }

  /**
   * Image Chosen From Camera
   */
  private addFromCamera() {
    try {
      // let carPicImages: any[] = [];
      const options: CameraOptions = {
        quality: 33,
        destinationType: this.camera.DestinationType.DATA_URL,
        encodingType: this.camera.EncodingType.JPEG,
        mediaType: this.camera.MediaType.PICTURE,
        correctOrientation: true,
        sourceType: this.camera.PictureSourceType.CAMERA,
        targetWidth: 400,
        targetHeight: 400,
        saveToPhotoAlbum: true
        // sourceType: 0
      };

      this.camera.getPicture(options).then(imageData => {
        // this.selectedImages = imageData !== null ? [imageData] : [];
        this.selectedImages = [];
        this.selectedImages.push(imageData);
        // this.galleryImages = [];
        // this.cameraImages = [];
        this.cameraImages.push(imageData);
        this.newCameraUploadImage('data:image/jpeg;base64,' + imageData).then(url => {
          // this.carService.carSelectedImages = [];
          this.carService.carSelectedImages.push(url);
        });
        // this.newUploadImage(imageData).then(url => {
        //   this.carService.carSelectedImages = [];
        //   this.carService.carSelectedImages.push(url);
        // });
      });
      // return this.camera.getPicture(options).then(
      //   imageData => imageData,
      //   // let base64Image = 'data:image/jpeg;base64,' + imageData;
      //   // this.uploadImage(base64Image);
      //   err => err
      // );
    } catch (error) {
      throw error;
    }
  }

  /**
   * To pick car image
   *  sourceType = 0 // Photo Library
   *  sourceType = 1 // Camera
   *  sourceType = 2 // Saved Photo Album
   */
  addFromGallery(choice: String) {
    try {
      switch (choice) {
        case 'gallery':
          this.addFromMobileGallery();
          break;
        case 'camera':
          this.addFromCamera();
          // this.selectedImages = res !== null ? [res] : [];
          break;
        default:
          break;
      }
    } catch (error) {
      this.commonService.errorAlert('Error', `Error while adding images!`);
    }
  }

  newEncodeImageUri(imageUri, callback) {
    var c = document.createElement('canvas');
    var ctx = c.getContext('2d');
    var img = new Image();
    img.onload = function() {
      var aux: any = this;
      c.width = aux.width;
      c.height = aux.height;
      ctx.drawImage(img, 0, 0);
      var dataURL = c.toDataURL('image/jpeg');
      callback(dataURL);
    };
    img.src = imageUri;
  }

  newCameraUploadImage(image64) {
    //base64Image
    return new Promise<any>((resolve, reject) => {
      let storageRef = firebase.storage().ref();
      let imageRef = storageRef
        .child('uploads')
        .child('images')
        .child(`${new Date().getTime()}`);
      // this.newEncodeImageUri(imageURI, function(image64) {
      imageRef.putString(image64, 'data_url').then(
        snapshot => {
          resolve(snapshot.downloadURL);
        },
        err => {
          reject(err);
        }
      );
      // });
    });
  }

  newUploadImage(imageURI) {
    //base64Image
    return new Promise<any>((resolve, reject) => {
      let storageRef = firebase.storage().ref();
      let imageRef = storageRef
        .child('uploads')
        .child('images')
        .child(`${new Date().getTime()}`);
      this.newEncodeImageUri(imageURI, function(image64) {
        imageRef.putString(image64, 'data_url').then(
          snapshot => {
            resolve(snapshot.downloadURL);
          },
          err => {
            reject(err);
          }
        );
      });
    });

    // const filePath = `uploads/images/${new Date().getTime()}`;
    // const ref = this.afStorage.ref(filePath);
    // this.task = ref.putString(base64Image, 'data_url');
    // return this.task
    //   .snapshotChanges()
    //   .pipe(
    //     finalize(() => {
    //       ref.getDownloadURL().subscribe(url => {
    //         return url;
    //       });
    //     })
    //   )
    //   .subscribe();
  }

  /**
   * To remove selected image before uploading
   * @param img Car Image
   */
  removeImage(imagesArr: any[], img: any) {
    // if (this.cameraImages && this.cameraImages.length > 0) {
    //   const index = this.cameraImages.findIndex(item => item === img);
    //   this.cameraImages.splice(index, 1);
    // } else {
    //   if (this.galleryImages && this.galleryImages.length > 0) {
    //     const index = this.galleryImages.findIndex(item => item === img);
    //     this.galleryImages.splice(index, 1);
    //   }
    // }
    if (imagesArr && imagesArr.length > 0) {
      const index = imagesArr.findIndex(item => item === img);
      imagesArr.splice(index, 1);
    }
    // const index = this.selectedImages.findIndex(item => item === img);
    // this.selectedImages.splice(index, 1);
    this.toastCtrl
      .create({
        position: 'bottom',
        message: 'Removed!',
        duration: 2000
      })
      .present();
  }

  public async asyncForEach(array, callback) {
    let length = array.length;
    for (let index = 0; index < length; index++) {
      await callback(array[index], index, array);
    }
  }
}
