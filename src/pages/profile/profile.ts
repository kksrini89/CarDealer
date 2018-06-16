import { Component } from '@angular/core';
import { IonicPage, NavController } from 'ionic-angular';
import { AuthProvider } from '../../providers/auth.service';
import { LoginPage } from '../login/login';
import { User } from '../../models/user.model';
import { AngularFirestoreCollection, AngularFirestore } from 'angularfire2/firestore';
import { Observable } from 'rxjs';

@IonicPage()
@Component({
  selector: 'page-profile',
  templateUrl: 'profile.html'
})
export class ProfilePage {
  userCollection: AngularFirestoreCollection<User>;
  user$: Observable<User[]>;
  loggedInUser: any = null;
  constructor(
    public navCtrl: NavController,
    private afStore: AngularFirestore,
    public auth: AuthProvider
  ) {
    this.userCollection = this.afStore.collection('users');
    this.user$ = this.userCollection.valueChanges();
    // console.log();
    this.auth.getCurrentUser().subscribe(res => {
      console.log(res);
      this.loggedInUser = res;
    });
    // this.loggedInUser = this.afStore.doc('users/')
  }

  ionViewCanEnter() {
    // console.log(this.aut)
    // return this.auth.isLoggedIn();
    return true;
  }

  logout() {
    // this.auth.signOut().then(() => this.navCtrl.parent.parent.setRoot(LoginPage));
    this.navCtrl.parent.parent.setRoot(LoginPage);
    // await this.navCtrl.parent.setRoot(LoginPage);
  }
}
