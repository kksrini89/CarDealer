import { Component } from '@angular/core';

import * as firebase from 'firebase/app';
import { AngularFireAuth } from 'angularfire2/auth';
import { GooglePlus } from '@ionic-native/google-plus';

import { Observable } from 'rxjs/Observable';
import { Platform } from 'ionic-angular';

@Component({
  selector: 'google-login',
  templateUrl: 'google-login.html'
})
export class GoogleLoginComponent {
  user: Observable<firebase.User>;

  constructor(
    private afAuth: AngularFireAuth,
    private gplus: GooglePlus,
    private platform: Platform
  ) {
    this.user = this.afAuth.authState;
    if (this.platform.is('cordova')) {
      this.nativeGoogleLogin();
    } else {
      this.webGoogleLogin();
    }
  }

  async nativeGoogleLogin() {
    try {
      const gplusUser = await this.gplus.login({
        webClientId: '30802465799-hgtp7kinapiocrg12cbti9lgk50rsd5o.apps.googleusercontent.com',
        offline: true,
        scopes: 'profile email'
      });
      return await this.afAuth.auth.signInWithCredential(
        firebase.auth.GoogleAuthProvider.credential(gplusUser.idToken)
      );
    } catch (error) {
      console.log(error);
    }
  }

  async webGoogleLogin() {
    try {
      const provider = new firebase.auth.GithubAuthProvider();
      const credential = await this.afAuth.auth.signInWithPopup(provider);
    } catch (error) {
      console.log(error);
    }
  }

  signOut() {
    this.afAuth.auth.signOut();
    if (this.platform.is('cordova')) {
      this.gplus.logout();
    }
  }
}
