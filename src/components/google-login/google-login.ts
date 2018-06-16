import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { AuthProvider } from '../../providers/auth.service';

@Component({
  selector: 'google-login',
  templateUrl: 'google-login.html'
})
export class GoogleLoginComponent {
  constructor(public auth: AuthProvider) {}

  // async googleLogin() {
  //   this.auth.googleLogin().then(() => this.navCtrl.setRoot('TabsPage'));
  // }
}
