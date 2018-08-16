import { Component } from '@angular/core';
import {
  // IonicPage,
  NavController,
  NavParams,
  LoadingController,
  ToastController
} from 'ionic-angular';
import { Network } from '@ionic-native/network';
import { NativeStorage } from '@ionic-native/native-storage';
// import * as firebase from 'firebase';
import { CommonProvider } from '../../providers/common.service';
import { AuthProvider } from '../../providers/auth.service';

@Component({
  selector: 'register',
  templateUrl: 'register.html'
})
export class RegisterComponent {
  signUpForm: any;

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    // private network: Network,
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
    // this.signUpForm['emptype'] = '';
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
          await this.authService.updateUserData({ ...user, name: this.signUpForm.name });
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
