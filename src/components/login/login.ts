import { Component } from '@angular/core';
import { NavController, NavParams, LoadingController, ToastController } from 'ionic-angular';
// import { Network } from '@ionic-native/network';
// import * as firebase from 'firebase/app';

import { SignupPage } from '../../pages/signup/signup';
import { CommonProvider } from '../../providers/common.service';
import { AuthProvider } from '../../providers/auth.service';

@Component({
  selector: 'login',
  templateUrl: 'login.html'
})
export class LoginComponent {
  loginform: any;

  constructor(
    public navCtrl: NavController,
    private loading: LoadingController,
    private toastCtrl: ToastController,
    public navParams: NavParams,
    // private network: Network,
    private commonservice: CommonProvider,
    private authservice: AuthProvider
  ) {
    this.loginform = {};
    this.loginform['email'] = '';
    this.loginform['password'] = '';
  }

  login() {
    // if (this.network.type === 'none' || this.network.type === null) {
    //   this.commonservice.errorAlert('Error', 'Please Check the Network Connection');
    //   return false;
    // }
    if (!this.commonservice.getvalid(this.loginform['email'])) {
      this.commonservice.errorAlert('Error', 'Please enter correct email');
      return false;
    }
    if (!this.commonservice.getvalid(this.loginform['password'])) {
      this.commonservice.errorAlert('Error', 'Please enter correct password');
      return false;
    }
    let loader = this.loading.create({
      content: 'Loading ....'
    });
    loader.present().then(() => {
      const credentials = {
        email: this.loginform['email'],
        password: this.loginform['password']
      };
      this.authservice
        .signInWithEmail(credentials)
        .then(async res => {
          // await this.authservice.updateUserData(user);
          console.log(res);
          if (res) {
            this.authservice
              .getUserProfile(res)
              .then((user: any) => {
                if (user) {
                  if (user.roles.admin || user.roles.editor) {
                    this.navCtrl.setRoot('TabsPage');
                  } else {
                    this.navCtrl.setRoot('SubscriberPage');
                  }
                  let toast = this.toastCtrl.create({
                    message: 'Logged In successfully.',
                    duration: 3000,
                    position: 'bottom'
                  });
                  toast.present();
                  loader.dismiss();
                }
              })
              .catch(err => err);
          }
        })
        .catch(err => {
          this.commonservice.errorAlert(err.code, err.message);
          console.log(err);
          loader.dismiss();
        });
      // firebase
      //   .auth()
      //   .signInWithEmailAndPassword(this.loginform['email'], this.loginform['password'])
      //   .then(response => {
      //     console.log(response);
      //     let toast = this.toastCtrl.create({
      //       message: 'Logged In successfully.',
      //       duration: 3000,
      //       position: 'bottom'
      //     });
      //     toast.present();
      //     loader.dismiss();
      //   })
      //   .catch(err => {
      //     this.commonservice.errorAlert(err.code, err.message);
      //     console.log(err);
      //     loader.dismiss();
      //   });
    });
  }

  signUp() {
    this.navCtrl.push(SignupPage);
  }

  async resetPassword() {
    if (this.loginform['email'] == '' || this.loginform['email'] == null) {
      this.toastCtrl
        .create({
          duration: 3000,
          position: 'bottom',
          message: `Please enter email id!`
        })
        .present();
    }
    const userProfile = await this.authservice.getUser(this.loginform['email']);
    // if (userProfile === null || userProfile === undefined) {
    //   this.toastCtrl
    //     .create({
    //       duration: 3000,
    //       position: 'bottom',
    //       message: 'User is not registered!'
    //     })
    //     .present();
    // }
    this.authservice
      .resetPassword(this.loginform['email'])
      .then(res => {
        this.toastCtrl
          .create({
            duration: 3000,
            position: 'bottom',
            message: `Reset Link sent`
          })
          .present();
      })
      .catch(err => this.commonservice.errorAlert('Error', err.message));
  }
}
