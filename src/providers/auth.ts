import { Injectable } from '@angular/core';

import { Platform } from 'ionic-angular';
import { AngularFireAuth } from 'angularfire2/auth';
import { AngularFirestore, AngularFirestoreDocument } from 'angularfire2/firestore';
import * as firebase from 'firebase/app';
// import { Observable } from 'rxjs/Observable';
// import 'rxjs/add/observable/of';
// import { Observable, of } from 'rxjs';
import { switchMap, first } from 'rxjs/operators';
import { GooglePlus } from '@ionic-native/google-plus';

import { User } from '../models/user.model';
import { Observable, of } from 'rxjs';

@Injectable()
export class AuthProvider {
  user$: Observable<User>;
  constructor(
    private platform: Platform,
    private afAuth: AngularFireAuth,
    private afs: AngularFirestore,
    private gplus: GooglePlus
  ) {
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
    try {
      if (this.platform.is('cordova')) {
        this.nativeGoogleLogin().then(async res => {
          return await this.updateUserData(res.user);
        });
      } else {
        this.webGoogleLogin().then(async res => {
          return await this.updateUserData(res.user);
        });
      }
    } catch (error) {
      console.log(error);
    }
  }

  private async nativeGoogleLogin(): Promise<any> {
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

  private async webGoogleLogin(): Promise<any> {
    try {
      const provider = new firebase.auth.GoogleAuthProvider();
      return await this.afAuth.auth.signInWithPopup(provider);
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

  // Current user as a Promise. Useful for one-off operations.
  async getCurrentUser(): Promise<any> {
    return this.user$.pipe(first()).toPromise();
  }

  // Current user as boolean Promise. Used in router guards
  async isLoggedIn(): Promise<boolean> {
    const user = await this.getCurrentUser();
    return !!user;
  }

  private async updateUserData(user) {
    // Sets user data to firestore on login
    const userRef: AngularFirestoreDocument<any> = this.afs.doc(`users/${user.uid}`);
    const data: User = {
      uid: user.uid,
      email: user.email,
      roles: {
        subscriber: true
      },
      photoURL: user.photoURL || 'https://goo.gl/7kz9qG'
    };
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
}
