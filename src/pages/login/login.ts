import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { AuthProvider } from '../../providers/auth.service';

@IonicPage()
@Component({
  selector: 'page-login',
  templateUrl: 'login.html'
})
export class LoginPage {
  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public auth: AuthProvider
  ) {}

  ionViewDidLoad() {
    console.log('ionViewDidLoad LoginPage');
  }

  googleLogin() {
    this.auth
      .googleLogin()
      .then(() => {
        this.auth.getCurrentUser().then(user => {
          if (user.roles.admin || user.roles.editor) {
            this.navCtrl.setRoot('TabsPage');
          } else {
            this.navCtrl.setRoot('SubscriberPage');
          }
        });
      })
      .catch(error => console.error(error));
    // this.navCtrl.setRoot()
    // .then(() => this.navCtrl.setRoot('TabsPage'))
    // .catch(err => console.log(err));
  }
}
