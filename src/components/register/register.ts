import { Component, AfterViewInit } from '@angular/core';
import {
  // IonicPage,
  NavController,
  NavParams,
  LoadingController,
  ToastController
} from 'ionic-angular';
import { NativeStorage } from '@ionic-native/native-storage';
import { Camera, CameraOptions } from '@ionic-native/camera';
import * as firebase from 'firebase/app';
// import { Network } from '@ionic-native/network';

import { CommonProvider } from '../../providers/common.service';
import { AuthProvider } from '../../providers/auth.service';

@Component({
  selector: 'register',
  templateUrl: 'register.html'
})
export class RegisterComponent {
  signUpForm: any;
  selectedImageURI: string = '';
  isDealerInputVisible: boolean = false;

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    private camera: Camera,
    public commonservice: CommonProvider,
    public loading: LoadingController,
    private toastCtrl: ToastController,
    private nativeStorage: NativeStorage,
    private authService: AuthProvider
  ) {
    this.signUpForm = {};
    this.signUpForm['name'] = '';
    this.signUpForm['email'] = '';
    this.signUpForm['password'] = '';
    this.signUpForm['dealer'] = {};
    this.signUpForm['dealer']['name'] = '';
    this.signUpForm['dealer']['showroomName'] = '';
    this.signUpForm['dealer']['address'] = '';
    this.signUpForm['dealer']['city'] = '';
    this.signUpForm['dealer']['state'] = '';
    this.signUpForm['dealer']['contact_no'] = '';
    this.signUpForm['photoURL'] = '';
  }

  onDealerNameChanged(event: any) {
    console.log(event);
    const inputVal = event.target.value;
    this.isDealerInputVisible = inputVal !== '' ? true : false;
  }

  uploadPhoto() {
    try {
      const options: CameraOptions = {
        correctOrientation: true,
        mediaType: this.camera.MediaType.PICTURE,
        sourceType: this.camera.PictureSourceType.PHOTOLIBRARY,
        destinationType: this.camera.DestinationType.DATA_URL,
        encodingType: this.camera.EncodingType.JPEG,
        quality: 33
      };

      this.camera.getPicture(options).then(img => {
        console.log(img);
        this.selectedImageURI = `data:image/jpeg;base64,${img}`; // for displaying purpose
        this.signUpForm['photoURL'] = this.selectedImageURI; // for storing/retrieving from db
        // let filePathWithQueryString = img;
        // const imagePath = filePathWithQueryString.split('?')[0];
        // const pathSegments = imagePath.split('/');
        // const imageName = pathSegments[pathSegments.length - 1];
        // this.signUpForm['photoURL'] = imageName;
        // this.selectedImageURI = imagePath;
        // this.commonservice.newUploadImage('data:image/jpeg;base64,' + img).then(img_url => {
        //   this.signUpForm['photoURL'] = img_url;
        //   // loading.dismiss();
        // });
      });
    } catch (error) {
      console.log(error.message);
    }
  }

  signUp() {
    // if (this.network.type === 'none' || this.network.type === null) {
    //   this.commonservice.errorAlert('Error', 'Please Check the Network Connection');
    //   return false;
    // }
    if (!this.commonservice.getvalid(this.signUpForm['name'])) {
      this.commonservice.errorAlert('Error', 'Please enter correct name');
      return false;
    }
    if (!this.commonservice.getvalid(this.signUpForm['email'])) {
      this.commonservice.errorAlert('Error', 'Please enter correct email');
      return false;
    }
    if (!this.commonservice.getvalid(this.signUpForm['password'])) {
      this.commonservice.errorAlert('Error', 'Please enter correct password');
      return false;
    }

    let loader = this.loading.create({
      content: 'Loading ....'
    });
    loader.present().then(() => {
      const credentials = {
        email: this.signUpForm['email'],
        password: this.signUpForm['password']
      };
      this.authService
        .signUp(credentials)
        .then(async user => {
          let dealer_info = {
            name: this.signUpForm['dealer']['name'],
            showroomName: this.signUpForm['dealer']['showroomName'],
            address: this.signUpForm['dealer']['address'],
            city: this.signUpForm['dealer']['city'],
            state: this.signUpForm['dealer']['state'],
            contact_no: this.signUpForm['dealer']['contact_no']
          };
          await this.authService.updateUserData({
            ...user,
            name: this.signUpForm.name,
            dealer_info: dealer_info,
            photoURL: this.signUpForm.photoURL ? this.signUpForm.photoURL : ''
          });
          this.nativeStorage.setItem('userDetails', this.signUpForm);
          console.warn('i entered successfully');
          console.warn(user);
          console.warn(typeof user);
          let toast = this.toastCtrl.create({
            message: 'Account created successfully.',
            duration: 3000,
            position: 'bottom'
          });
          toast.present();
          this.isDealerInputVisible = false;
          this.authService.getUserProfile(user).then((user: any) => {
            if (user) {
              if (user.roles.admin || user.roles.editor) {
                this.navCtrl.setRoot('TabsPage');
              } else {
                this.navCtrl.setRoot('SubscriberPage');
              }
            }
            loader.dismiss();
          });
        })
        .catch(err => {
          console.error(err);
          this.commonservice.errorAlert(err.code, err.message);
          loader.dismiss();
        });
      /* firebase
        .auth()
        .createUserWithEmailAndPassword(this.signUpForm['email'], this.signUpForm['password'])
        .then(response => {
          this.nativeStorage.setItem('userDetails', this.signUpForm);
          /* this.commonservice.insertUser(this.signUpForm).subscribe(
            result => {
              console.warn('i entered successfully');
              console.warn(result);
              console.warn(typeof result);
              let toast = this.toastCtrl.create({
                message: 'Account created successfully.',
                duration: 3000,
                position: 'bottom'
              });
              toast.present();
              // if (this.signUpForm['emptype'] === 'M') {
              //   this.navCtrl.setRoot(TabsPage, { tabIndex: 0 });
              // } else {
              //   this.navCtrl.setRoot(HomePage);
              // }
              loader.dismiss();
            },
            function(error) {
              console.error(error);
              loader.dismiss();
            }
          );
        })
        .catch(err => {
          console.error(err);
          this.commonservice.errorAlert(err.code, err.message);
          loader.dismiss();
        });*/
    });
  }
}
