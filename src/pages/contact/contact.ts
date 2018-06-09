import { Component } from '@angular/core';
import { IonicPage, NavController } from 'ionic-angular';
import { AuthProvider } from '../../providers/auth';
import { LoginPage } from '../login/login';

@IonicPage()
@Component({
  selector: 'page-contact',
  templateUrl: 'contact.html'
})
export class ContactPage {
  constructor(public navCtrl: NavController, public auth: AuthProvider) {}

  async logout() {
    await this.auth.signOut();
    await this.navCtrl.setRoot(LoginPage);
  }
}
