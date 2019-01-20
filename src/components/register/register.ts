import { Component } from '@angular/core';
import {
  // IonicPage,
  NavController,
  NavParams,
  LoadingController,
  ToastController
} from 'ionic-angular';
import { NativeStorage } from '@ionic-native/native-storage';
import { Camera, CameraOptions } from '@ionic-native/camera';
// import * as firebase from 'firebase/app';
import * as jwt from 'jwt-decode';
// import { Network } from '@ionic-native/network';

import { CommonProvider } from '../../providers/common.service';
import { AuthProvider } from '../../providers/auth.service';
// import { User } from '../../models/user.model';
import { Storage } from '@ionic/storage';
import { File } from '@ionic-native/file';

@Component({
  selector: 'register',
  templateUrl: 'register.html'
})
export class RegisterComponent {
  signUpForm: any;
  selectedProfileImageURI: string = '';
  selectedDealerImageURI: string = '';
  isDealerInputVisible: boolean = false;
  // file: File;

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    private camera: Camera,
    public commonservice: CommonProvider,
    public loading: LoadingController,
    private toastCtrl: ToastController,
    private nativeStorage: NativeStorage,
    private storage: Storage,
    private authService: AuthProvider,
    public file: File
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
    this.signUpForm['dealer']['profile_image'] = '';
    this.signUpForm['photoURL'] = '';
  }

  onDealerNameChanged(event: any) {
    console.log(event);
    const inputVal = event.target.value;
    this.isDealerInputVisible = inputVal !== '' ? true : false;
  }

  async uploadDealerProfileImage() {
    try {
      const options: CameraOptions = {
        correctOrientation: true,
        mediaType: this.camera.MediaType.PICTURE,
        // sourceType: this.camera.PictureSourceType.PHOTOLIBRARY,
        destinationType: this.camera.DestinationType.FILE_URI,
        encodingType: this.camera.EncodingType.JPEG,
        quality: 80
      };

      const cameraInfo = await this.camera.getPicture(options);
      console.log(cameraInfo);

      this.signUpForm['dealer']['profile_image'] = await this.makeFileIntoBlob(cameraInfo);
      console.log(this.signUpForm['dealer']['profile_image']);
      if (this.signUpForm['dealer']['profile_image'] !== null && this.signUpForm['dealer']['profile_image'] !== '') {
        this.selectedDealerImageURI = this.signUpForm['dealer']['profile_image']['fileName'];
      }
      /*this.camera.getPicture(options).then(img => {
        console.log(img);
        this.signUpForm['dealer']['profile_image'] = this.makeFileIntoBlob(img);
        console.log(this.signUpForm['dealer']['profile_image']);

        // this.signUpForm['dealer']['profile_image'] = img; //`data:image/jpeg;base64,${img}`;
      });*/
    } catch (error) {
      console.log(error.message);
    }
  }

  async uploadPhoto() {
    try {
      const options: CameraOptions = {
        correctOrientation: true,
        mediaType: this.camera.MediaType.PICTURE,
        // sourceType: this.camera.PictureSourceType.PHOTOLIBRARY,
        destinationType: this.camera.DestinationType.FILE_URI,
        encodingType: this.camera.EncodingType.JPEG,
        quality: 80
      };

      const cameraInfo = await this.camera.getPicture(options);
      console.log(cameraInfo);
      this.signUpForm['photoURL'] = await this.makeFileIntoBlob(cameraInfo);
      console.log(this.signUpForm['photoURL']);

      if (this.signUpForm['photoURL'] !== null && this.signUpForm['photoURL']!== '') {
        this.selectedProfileImageURI = this.signUpForm['photoURL']['fileName'];
      }
      /*this.camera.getPicture(options).then(img => {
        console.log(img);
        this.signUpForm['photoURL'] = this.makeFileIntoBlob(img);
        console.log(this.signUpForm['photoURL']);
        // this.signUpForm['photoURL'] = img;

        //this.selectedImageURI = `data:image/jpeg;base64,${img}`; // for displaying purpose
        //this.signUpForm['photoURL'] = this.selectedImageURI; // for storing/retrieving from db

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
      });*/
    } catch (error) {
      console.log(error.message);
    }
  }

  // FILE STUFF
  makeFileIntoBlob(_imagePath) {
    // INSTALL PLUGIN - cordova plugin add cordova-plugin-file
    return new Promise((resolve, reject) => {
      let fileName = "";
      this.file
        .resolveLocalFilesystemUrl(_imagePath)
        .then(fileEntry => {
          console.log(fileEntry);
          let { name, nativeURL } = fileEntry;

          // get the path..
          let path = nativeURL.substring(0, nativeURL.lastIndexOf("/"));

          fileName = name;

          // we are provided the name, so now read the file into a buffer
          return this.file.readAsArrayBuffer(path, name);
        })
        .then(buffer => {
          // get the buffer and make a blob to be saved
          let imgBlob = new Blob([buffer], {
            type: "image/jpeg"
          });

          // pass back blob and the name of the file for saving
          // into mongodb
          resolve({
            fileName,
            imgBlob
          });
        })
        .catch(e => reject(e));
    });
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
      const input = {
        name: this.signUpForm['name'],
        email: this.signUpForm['email'],
        password: this.signUpForm['password'],
        profile_image: this.signUpForm['photoURL'],
        dealer_name: this.signUpForm['dealer']['name'],
        dealer_image: this.signUpForm['dealer']['profile_image'],
        showroomName: this.signUpForm['dealer']['showroomName'],
        address: this.signUpForm['dealer']['address'],
        city: this.signUpForm['dealer']['city'],
        state: this.signUpForm['dealer']['state'],
        contact_no: this.signUpForm['dealer']['contact_no']
      };
      const inputFormData: FormData = this.frameBodyParam(input);
      this.authService
        .signUp(inputFormData)
        .then(async user => {
          // let dealer_info = {
          //   name: this.signUpForm['dealer']['name'],
          //   showroomName: this.signUpForm['dealer']['showroomName'],
          //   address: this.signUpForm['dealer']['address'],
          //   city: this.signUpForm['dealer']['city'],
          //   state: this.signUpForm['dealer']['state'],
          //   contact_no: this.signUpForm['dealer']['contact_no'],
          //   profile_image: this.signUpForm['dealer']['profile_image']
          // };
          // await this.authService.updateUserData({
          //   ...user,
          //   name: this.signUpForm.name,
          //   dealer_info: dealer_info,
          //   photoURL: this.signUpForm.photoURL ? this.signUpForm.photoURL : ''
          // });
          // await this.nativeStorage.setItem('token', user['token']);
          // await this.nativeStorage.setItem('user_id', user['_id']);
          await this.storage.set('token', user['token']);
          await this.storage.set('user_id', user['_id']);
          const res: any = jwt(user['token']);

          // await this.nativeStorage.setItem('userDetails', this.signUpForm);
          // await this.storage.set('userDetails', this.signUpForm);
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
          if (res) {
            if (res.user.roles.admin || res.user.roles.editor) {
              this.navCtrl.setRoot('TabsPage');
            } else {
              this.navCtrl.setRoot('SubscriberPage');
            }
          }
          loader.dismiss();
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

  private frameBodyParam(input: any): FormData {
    try {
      let formData = new FormData();
      if (input.profile_image) {
        formData.append('profile_image', input.profile_image.imgBlob, input.profile_image.fileName);
        // const fileName = input.profile_image.substr(input.profile_image.lastIndexOf('/') + 1);
        // formData.append('profile_image', input.profile_image, fileName);

        // this.readFile(input.profile_image, formData, 'profile_image');
      }
      if (input.dealer_image) {
        formData.append('dealer_image', input.dealer_image.imgBlob, input.dealer_image.fileName);
        // const fileName = input.dealer_image.substr(input.dealer_image.lastIndexOf('/') + 1);
        // formData.append('dealer_image', input.dealer_image, fileName);

        // this.readFile(input.dealer_image, formData, 'dealer_image');
      }
      formData.append('name', input.name);
      formData.append('email', input.email);
      formData.append('password', input.password);
      formData.append('dealer_name', input.dealer_name);
      formData.append('showroomName', input.showroomName);
      formData.append('address', input.address);
      formData.append('city', input.city);
      formData.append('state', input.state);
      formData.append('contact_no', input.contact_no);

      return formData;
    } catch (error) {
      throw error;
    }
  }

  // private readFile(file: any, formDataInput: FormData) {
  //   const reader = new FileReader();
  //   reader.onloadend = () => {
  //     const imgBlob = new Blob([reader.result], { type: file.type });
  //     formDataInput.append('photos', imgBlob, file.name);
  //   };
  //   reader.readAsArrayBuffer(file);
  //   return formDataInput;
  // }

  private readFile(file: any, formDataInput: FormData, imageType: string) {
    const fileInput = file.split('?', file.lastIndexOf('/') + 1)[0];
    const fileName = file.substr(file.lastIndexOf('/') + 1); //.split('?')[0];
    const fileType = fileName.split('.').pop();
    const reader = new FileReader();
    reader.onload = () => {
      // const formData = new FormData();
      const imgBlob = new Blob([reader.result], {
        type: fileType
      });
      formDataInput.append(imageType, imgBlob, fileName);//file.name);
    };
    reader.readAsArrayBuffer(fileInput);
  }
}
