import { Component } from '@angular/core';
import { Platform } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import * as firebase from 'firebase/app';

import { AuthProvider } from '../providers/auth.service';

// import { TabsPage } from '../pages/tabs/tabs';
// import { LoginPage } from '../pages/login/login';
import { timer } from 'rxjs/observable/timer';

@Component({
  templateUrl: 'app.html'
})
export class MyApp {
  rootPage: any = 'LoginPage';
  showSplash: boolean = true;
  constructor(
    platform: Platform,
    statusBar: StatusBar,
    splashScreen: SplashScreen,
    authService: AuthProvider
  ) {
    platform.ready().then(() => {
      const firestore = firebase.firestore();
      const settings = {timestampsInSnapshots: true};
      firestore.settings(settings);
      authService.isLoggedIn().then(res => {
        if (res) {
          this.rootPage = 'TabsPage';
        } else {
          this.rootPage = 'LoginPage';
        }
        // Okay, so the platform is ready and our plugins are available.
        // Here you can do any higher level native things you might need.
        statusBar.styleDefault();
        splashScreen.hide();
        timer(3000).subscribe(() => (this.showSplash = false));
      });
    });
  }
}
