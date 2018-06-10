import { Component } from '@angular/core';
import { IonicPage, NavController } from 'ionic-angular';
import { AuthProvider } from '../../providers/auth';
import { LoginPage } from '../login/login';

@IonicPage()
@Component({
  selector: 'page-profile',
  templateUrl: 'profile.html'
})
export class ProfilePage {
  _app;
  constructor(public navCtrl: NavController, public auth: AuthProvider) {}

  ionViewCanEnter() {
    return this.auth.isLoggedIn();
  }

  async logout() {
    await this.auth.signOut();
    this.navCtrl.parent.parent.setRoot(LoginPage);
    // await this.navCtrl.parent.setRoot(LoginPage);
  }
}
