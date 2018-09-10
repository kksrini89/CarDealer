import { Injectable } from '@angular/core';
// import { HttpClient } from '@angular/common/http';

import { Platform } from 'ionic-angular';
import { GooglePlus } from '@ionic-native/google-plus';
import * as firebase from 'firebase/app';
import { AngularFireAuth } from 'angularfire2/auth';
import { AngularFirestore, AngularFirestoreDocument } from 'angularfire2/firestore';

import { User } from '../models/user.model';
import { Observable, of } from 'rxjs';
import { switchMap, first } from 'rxjs/operators';
// import { map } from 'rxjs-compat/operator/map';

@Injectable()
export class AuthProvider {
  user$: Observable<User>;
  userProfile: any = null;
  dealers: any[] = [];
  selectedDealer: any;
  constructor(
    private platform: Platform,
    // private http: HttpClient,
    private afAuth: AngularFireAuth,
    private afs: AngularFirestore,
    private gplus: GooglePlus
  ) {
    // this.afAuth.auth.onAuthStateChanged(user => {
    //   if (user) {
    //     this.userProfile = user;
    //   } else {
    //     this.userProfile = null;
    //   }
    // });
    this.selectedDealer = {};
    this.user$ = this.afAuth.authState.pipe(
      switchMap(user => {
        if (user) {
          return this.afs.doc<any>(`users/${user.uid}`).valueChanges();
        } else {
          return of(null);
        }
      })
    );
  }

  async googleLogin() {
    this.gplus
      .login({
        webClientId: '698468554914-mr69c77ffau1uf5vq3mg7arf2ekhv86m.apps.googleusercontent.com',
        offline: true,
        scopes: 'profile email'
      })
      .then(res => {
        this.afAuth.auth
          .signInWithCredential(firebase.auth.GoogleAuthProvider.credential(res.idToken))
          .then(async res => {
            await this.updateUserData(res);
          });
      });
    // this.gplus
    //   .login({
    //     webClientId: '30802465799-hgtp7kinapiocrg12cbti9lgk50rsd5o.apps.googleusercontent.com',
    //     offline: true
    //     // scopes: 'profile email'
    //   })
    //   .then(res => {
    //     const googleCredential = firebase.auth.GoogleAuthProvider.credential(res.idToken);

    //     firebase
    //       .auth()
    //       .signInWithCredential(googleCredential)
    //       .then(response => {
    //         console.log('Firebase success: ' + JSON.stringify(response));
    //       });
    //   });

    // try {

    /*
    if (this.platform.is('cordova')) {
      await this.nativeGoogleLogin();
    } else {
      await this.webGoogleLogin();
    }  */

    // } catch (error) {
    //   console.log(error);
    // }
  }

  async nativeGoogleLogin() {
    const gplusUser = await this.gplus.login({
      webClientId: '698468554914-mr69c77ffau1uf5vq3mg7arf2ekhv86m.apps.googleusercontent.com',
      offline: true,
      scopes: 'profile email'
    });

    this.afAuth.auth
      .signInWithCredential(firebase.auth.GoogleAuthProvider.credential(gplusUser.idToken))
      .then(async res => {
        await this.updateUserData(res);
      });
    // try {
    // this.gplus
    //   .login({
    //     'webClientId': '',
    //     'offline': true,
    //     'scopes': 'profile email'
    //   })
    //   .then(res => {
    //     const googleCredential = firebase.auth.GoogleAuthProvider.credential(res.idToken);

    //     firebase
    //       .auth()
    //       .signInWithCredential(googleCredential)
    //       .then(response => {
    //         console.log('Firebase success: ' + JSON.stringify(response));
    //       });
    //   });

    // .then(res => {
    //   console.log(res);
    //   return this.afAuth.auth.signInWithCredential(
    //     firebase.auth.GoogleAuthProvider.credential(res.idToken)
    //   );
    // });
    // }
    // catch(error) {
    //     console.log(error);
    //   }
  }

  webGoogleLogin() {
    try {
      const provider = new firebase.auth.GoogleAuthProvider();
      this.afAuth.auth.signInWithPopup(provider).then(res => this.updateUserData(res.user));
      // return await this.updateUserData(credential.user);
    } catch (error) {
      console.log(error);
    }
  }

  async signOut() {
    await this.afAuth.auth.signOut();
    if (this.platform.is('cordova')) {
      this.gplus.logout().then(res => console.log(' logged out!'));
    }
  }

  // Current user as a Promise. Useful for one-off operations.
  getCurrentUser() {
    try {
      return this.user$.pipe(first()).toPromise();
    } catch (error) {
      throw error;
    }
    // return this.afAuth.authState.toPromise();
    // return this.userProfile;
  }

  // Current user as boolean Promise. Used in router guards
  async isLoggedIn(): Promise<boolean> {
    // return await this.getCurrentUser();
    // return this.getCurrentUser().subscribe(res => !!res);
    const user = await this.getCurrentUser();
    return !!user;
  }

  getUserProfile(user: User) {
    try {
      return this.afs
        .doc(`users/${user.uid}`)
        .valueChanges()
        .pipe(first())
        .toPromise();
    } catch (error) {
      throw error;
    }
  }

  getUser(email: string) {
    try {
      return this.afs
        .collection('users', ref => ref.where('email', '==', email))
        .valueChanges()
        .pipe(first())
        .toPromise();
    } catch (error) {
      throw error;
    }
  }

  getUsers() {
    try {
      return this.afs.collection('users').valueChanges();
    } catch (error) {
      throw error;
    }
  }

  getDealers() {
    this.getUsers().subscribe(data => {
      const users = data;
      let authUsers = users.filter(user => {
        if (user['roles']) {
          let isAuthorized = user['roles']['editor'] || user['roles']['admin'];
          if (isAuthorized) {
            //this.dealers.push(user['dealer_info']);
            return user;
          }
        }
      });
      this.dealers = authUsers.map(a => {
        if (a && a['dealer_info']) {
          return a['dealer_info'];
        }
      });
    });
  }

  public async updateUserData(user) {
    // Sets user data to firestore on login
    const userRef: AngularFirestoreDocument<any> = this.afs.doc(`users/${user.uid}`);
    let data: User = {
      name: user.name,
      uid: user.uid,
      email: user.email,
      roles: {
        subscriber: true
      },
      dealer_info: {
        name: user.dealer_info.name, //['dealerForm.name'],
        showroomName: user.dealer_info.showroomName,
        address: user.dealer_info.address,
        city: user.dealer_info.city,
        state: user.dealer_info.state,
        contact_no: user.dealer_info.contact_no
      },
      photoURL: user.photoURL || 'https://goo.gl/7kz9qG'
    };
    // const data: User = {
    //   name: user.name,
    //   uid: user.uid,
    //   email: user.email,
    //   roles: {
    //     subscriber: true
    //   },
    //   photoURL: user.photoURL || 'https://goo.gl/7kz9qG'
    // };
    return await userRef.set(data, { merge: true });
  }

  ///// Role-based Authorization //////

  canRead(user: User): boolean {
    const allowed = ['admin', 'editor', 'subscriber'];
    return this.checkAuthorization(user, allowed);
  }

  canEdit(user: User): boolean {
    const allowed = ['admin', 'editor'];
    return this.checkAuthorization(user, allowed);
  }

  canDelete(user: User): boolean {
    const allowed = ['admin'];
    return this.checkAuthorization(user, allowed);
  }

  // determines if user has matching role
  private checkAuthorization(user: User, allowedRoles: string[]): boolean {
    if (!user) return false;
    for (const role of allowedRoles) {
      if (user.roles[role]) {
        return true;
      }
    }
    return false;
  }

  // Login
  signInWithEmail(credentials) {
    console.log('Sign in with email');
    return this.afAuth.auth.signInWithEmailAndPassword(credentials.email, credentials.password);
  }

  // Register
  signUp(credentials) {
    return this.afAuth.auth.createUserWithEmailAndPassword(credentials.email, credentials.password);
  }

  resetPassword(email: string) {
    return this.afAuth.auth.sendPasswordResetEmail(email);
  }
}
