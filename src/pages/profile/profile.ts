import { Component } from '@angular/core';
import { IonicPage, NavController } from 'ionic-angular';
import { Observable } from 'rxjs';
import { AngularFirestoreCollection, AngularFirestore } from 'angularfire2/firestore';
import * as jwt from 'jwt-decode';
import { LoginPage } from '../login/login';

import {settings } from '../../config/config';
import { User } from '../../models/user.model';
import { AuthProvider } from '../../providers/auth.service';
import { NativeStorage } from '@ionic-native/native-storage';
import { Storage } from '@ionic/storage';

@IonicPage()
@Component({
  selector: 'page-profile',
  templateUrl: 'profile.html'
})
export class ProfilePage {
  userCollection: AngularFirestoreCollection<User>;
  user$: Observable<User[]>;
  loggedInUser: any = null;
  apiUrl: string = 'http://192.168.0.102:7777/api/auth';

  constructor(
    public navCtrl: NavController,
    private afStore: AngularFirestore,
    public auth: AuthProvider,
    public storage: NativeStorage,
    public store: Storage
  ) {
    this.userCollection = this.afStore.collection('users');
    this.user$ = this.userCollection.valueChanges();
    this.store.get('token').then(res => {
      // console.log(res);
      const decodedData:any = jwt(res);
      this.loggedInUser = decodedData.user;
      console.log(this.loggedInUser);
      // this.loggedInUser = res;
    });
    // this.auth.getCurrentUser().then(res => {
    //   console.log(res);
    //   this.loggedInUser = res;
    // });
  }

  ionViewCanEnter() {
    // console.log(this.aut)
    return this.auth.isLoggedIn();
    // return true;
  }

  async logout() {
    // this.auth.signOut().then(() => this.navCtrl.parent.parent.setRoot(LoginPage));
    const token = await this.store.get('token');
    if (token) {
      await this.store.remove('token');
      await this.store.remove('user_id');
    }
    this.navCtrl.parent.parent.setRoot(LoginPage);
    // await this.navCtrl.parent.setRoot(LoginPage);
  }
}
