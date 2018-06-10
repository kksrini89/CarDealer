import { Component } from '@angular/core';

// import { HomePage } from '../home/home';
import { IonicPage } from 'ionic-angular';
import { AuthProvider } from '../../providers/auth';

@IonicPage()
@Component({
  templateUrl: 'tabs.html'
})
export class TabsPage {
  // tab1Root = 'HomePage';
  tab2Root = 'UploadPage';
  tab3Root = 'ProfilePage';
  tab4Root = 'DisplayPage';

  constructor(private auth: AuthProvider) {}

  ionViewCanEnter() {
    return this.auth.isLoggedIn();
  }
}
