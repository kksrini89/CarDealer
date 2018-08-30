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

import { AuthProvider } from '../../providers/auth.service';
import { CommonProvider } from '../../providers/common.service';
import { CarAdminProvider } from '../../providers/car-admin.service';
import { Observable } from 'rxjs';
import { finalize } from 'rxjs/operators';
import { Storage } from '@ionic/storage';

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

  public dealerForm: any;
  public carDetailForm: FormGroup;
  public stockerForm: FormGroup;
  public regInfoForm: FormGroup;
  public priceForm: FormGroup;
  public submitAttempt: boolean = false;
  public loading: Loading;
  public selectedImages: any[];
  public cameraImages: any[];
  public galleryImages: any[];

  constructor(
    public formBuilder: FormBuilder,
    public navCtrl: NavController,
    public toastCtrl: ToastController,
    public loadingCtrl: LoadingController,
    public alertCtrl: AlertController,
    public camera: Camera,
    public imagePicker: ImagePicker,
    private storage: Storage,
    public afStorage: AngularFireStorage,
    public auth: AuthProvider,
    private carService: CarAdminProvider,
    private commonService: CommonProvider
  ) {
    this.selectedImages = [];
    this.galleryImages = [];
    this.cameraImages = [];
    this.dealerForm = {
      name: '',
      showroomName: '',
      address: '',
      city: '',
      state: '',
      contact_no: ''
      // isMobileNumberValid: true
    };
  }

  ngAfterViewInit() {
    this.carSlider.autoHeight = true;
    this.storage.get('dealer_info').then(dealer_info => {
      console.log(dealer_info);
      this.dealerForm = {
        name: dealer_info['name'],
        showroomName: dealer_info.showroomName,
        address: dealer_info.address,
        city: dealer_info.city,
        state: dealer_info.state,
        contact_no: dealer_info.contact_no
      };
    });
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

  resetDealerDetails() {
    this.dealerForm = {
      name: '',
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
      name: '',
      showroomName: '',
      address: '',
      city: '',
      state: '',
      contact_no: ''
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

  async save() {
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
          description: this.carDetailForm.get('description').value
        };
        newCar.isCarAccidental = this.carDetailForm.get('isCarAccidental').value;
        newCar.isCarCertified = this.carDetailForm.get('isCarCertified').value;
        newCar.isCarFloodAffected = this.carDetailForm.get('isCarFloodAffected').value;
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
        newCar.name = this.dealerForm.name;
        newCar.showroomName = this.dealerForm.showroomName;
        newCar.address = this.dealerForm.address;
        newCar.city = this.dealerForm.city;
        newCar.state = this.dealerForm.state;
        newCar.contact_no = this.dealerForm.contact_no;
        console.log(newCar);

        // Uploading to db
        await this.carService.addCar(newCar);

        // Storing dealer details to native storage
        const dealer_info = {
          name: newCar.name,
          showroomName: newCar.showroomName,
          address: newCar.address,
          city: newCar.city,
          state: newCar.state,
          contact_no: newCar.contact_no
        };
        this.storage
          .set('dealer_info', dealer_info)
          .then(data => console.log(`Entered - ${data}`));

        // Reset fields
        this.stockerForm.reset();
        this.priceForm.reset();
        this.regInfoForm.reset();
        this.carDetailForm.reset();
        // this.resetDealerDetails();
        this.selectedImages = [];
        this.galleryImages = [];
        this.cameraImages = [];
        this.carService.carSelectedImages = [];
        this.submitAttempt = false;
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
      this.imagePicker.hasReadPermission().then(
        result => {
          if (result == false) {
            // no callbacks required as this opens a popup which returns async
            this.imagePicker.requestReadPermission();
          } else if (result == true) {
            this.imagePicker
              .getPictures({
                maximumImagesCount: 4
              })
              .then(
                results => {
                  this.carService.carSelectedImages = [];
                  for (var i = 0; i < results.length; i++) {
                    // this.uploadImageToFirebase(results[i]);
                    this.newUploadImage(results[i]).then(url =>
                      this.carService.carSelectedImages.push(url)
                    ); //carPicImages.push(url));
                  }
                  if (results && typeof results === 'object' && results.constructor === Array) {
                    this.selectedImages = results;
                    this.cameraImages = [];
                    this.galleryImages = results;
                  }
                },
                err => console.log(err)
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
        sourceType: this.camera.PictureSourceType.CAMERA
        // sourceType: 0
      };

      this.camera.getPicture(options).then(imageData => {
        // this.selectedImages = imageData !== null ? [imageData] : [];
        this.selectedImages = [];
        this.selectedImages.push(imageData);
        this.galleryImages = [];
        this.cameraImages = [];
        this.cameraImages.push(imageData);
        this.newCameraUploadImage('data:image/jpeg;base64,' + imageData).then(url => {
          this.carService.carSelectedImages = [];
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
